/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  authMiddleware,
  errorMiddleware,
  uploadsMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { nextTick } from 'node:process';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));

app.post('/api/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    const sql = `
    insert into "Users" ("username", "hashedPassword")
    values($1, $2)
    returning *;
    `;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/api/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }

    const sql = `
    select "userId","hashedPassword"
    from "Users"
    where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) throw new ClientError(401, `User: ${user} does not exist`);
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

app.post(
  '/api/create-listing',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { artist, album, genre, condition, price, additionalInfo } =
        req.body;
      console.log('running');
      const sql = `
      insert into "Records" ("imageSrc", "artist", "albumName", "genreId", "condition", "price", "info", "sellerId")
      values($1, $2, $3, $4, $5, $6, $7, $8)
      returning *;
      `;
      const params = [
        `/images/${req.file?.filename}`,
        artist,
        album,
        genre,
        condition,
        price,
        additionalInfo,
        req.user?.userId,
      ];
      console.log('params:', params);
      const result = await db.query(sql, params);
      const listing = result.rows[0];
      res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/get-genres', async (req, res, next) => {
  try {
    const sql = `
    select * from "Genres"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/all-products', async (req, res, next) => {
  try {
    const sql = `
    select * from "Records"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// app.get('/api/products/:recordId', async (req, res, next) => {
//   try {
//     const recordId = Number(req.params.recordId);
//     if(!recordId) throw new ClientError(400, 'recordId must be a positive integer');
//     const sql = `
//     select "recordId",
//            "
//     `
//   } catch (error) {
//     next(error)
//   }
// })
/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Vite server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
