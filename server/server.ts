/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
import pg from 'pg';
import {
  ClientError,
  authMiddleware,
  errorMiddleware,
  uploadsMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { nextTick } from 'node:process';
import { useParams } from 'react-router-dom';
import { DatabaseError } from 'pg-protocol';

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
      const { artist, album, genre, condition, price, info } = req.body;
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
        info,
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

app.get('/api/products/:recordId', async (req, res, next) => {
  try {
    const recordId = Number(req.params.recordId);
    if (!recordId)
      throw new ClientError(400, 'recordId must be a positive integer');
    const sql = `
    select "recordId",
           "imageSrc",
           "artist",
           "albumName",
           "genreId",
           "condition",
           "price",
           "info",
           "sellerId",
           "Genres"."name" as "genre"
    from "Records"
    join "Genres" using ("genreId")
    where "recordId" = $1
    `;
    const params = [recordId];
    const result = await db.query(sql, params);
    if (!result.rows[0]) {
      throw new ClientError(
        404,
        `Cannot find record with recordId: ${recordId}`
      );
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get('/api/genre/:genreId', async (req, res, next) => {
  try {
    const genreId = Number(req.params.genreId);
    if (!genreId)
      throw new ClientError(400, 'genreId must be a positive integer');
    const sql = `
    select "name"
    from "Genres"
    where "genreId" = $1
    `;
    const params = [genreId];
    const result = await db.query(sql, params);
    if (!result.rows[0]) {
      throw new ClientError(404, `Cannot find genre with genreId: ${genreId}`);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/cart/add', authMiddleware, async (req, res, next) => {
  try {
    const { recordId } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      console.error('User ID not available in request');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const checkCartSql = `
      select * from "Cart" where "userId" = $1
      `;
    const checkCartParams = [userId];
    const checkCartResult = await db.query(checkCartSql, checkCartParams);
    if (checkCartResult.rowCount === 0) {
      const createCartSql = `
        insert into "Cart" ("userId") values ($1) returning *;
      `;
      const createCartParams = [userId];
      const createCartResult = await db.query(createCartSql, createCartParams);

      if (createCartResult.rowCount === 0) {
        console.error('Error creating cart for user:', userId);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    console.log('userId:', userId);
    const sql = `
    insert into "CartItems" ("cartId", "recordId","quantity")
    select "cartId", $2, 1
    from "Cart"
    where "userId" = $1
    returning *;
    `;
    const params = [userId, recordId];
    console.log('params', params);

    const result = await db.query(sql, params);

    const cart = result.rows[0];
    console.log('cart:', cart);
    const readProduct = `select "recordId",
           "imageSrc",
           "artist",
           "albumName",
           "genreId",
           "condition",
           "price",
           "info",
           "sellerId",
           "Genres"."name" as "genre"
    from "Records"
    join "Genres" using ("genreId")
    where "recordId" = $1
    `;
    const productParams = [recordId];
    const productResult = await db.query(readProduct, productParams);
    res.status(201).json({ ...productResult.rows[0], itemsId: cart.itemsId });
  } catch (error) {
    next(error);
  }
});

app.get('/api/cart', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID not available in request');
    const sql = `
    select * from "Cart"
    join "CartItems" using ("cartId")
    join "Records" using ("recordId")
    where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.delete(
  '/api/cart/remove/:itemsId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { itemsId } = req.params;

      const id = Number(itemsId);
      if (typeof id !== 'number') {
        throw new ClientError(400, 'RecordId must be a number');
      }

      const userId = req.user?.userId;
      if (!userId) throw new Error('User ID not available in request');

      const sql = `
    delete from "CartItems"
    where "itemsId" = $1
    returning *;
    `;
      const params = [id];
      const result = await db.query(sql, params);
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/api/active-listings/:userId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.userId);
      const sql = `
    select * from "Records"
    join "Users" on "Records"."sellerId" = "Users"."userId"
    where "Users"."userId" = $1
    `;
      const params = [userId];
      const result = await db.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('/api/delete-listing/:recordId', async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const id = Number(recordId);
    const sql = `
    delete from "Records"
    where "recordId" = $1
    `;
    const params = [id];
    const result = await db.query(sql, params);
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof DatabaseError && error.code === '23503') {
      next(new ClientError(421, 'Cant delete item in someones cart'));
    } else {
      next(error);
    }
  }
});

app.put(
  '/api/update-listing/:recordId',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { recordId } = req.params;
      const id = Number(recordId);
      const sql = `
    update "Records"
    set "artist" = $1,
    ${
      req.file?.filename ? `"imageSrc" = '/images/${req.file?.filename}', ` : ''
    }
    "albumName" = $2,
    "genreId" = $3,
    "condition" = $4,
    "price" = $5,
    "info" = $6
    where "recordId" = $7
    returning *;
    `;
      const params = [
        req.body.artist,
        req.body.album,
        req.body.genre,
        req.body.condition,
        req.body.price,
        req.body.info,
        id,
      ];
      const result = await db.query(sql, params);
      const listing = result.rows[0];
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('/api/cart/all/:userId', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
    delete from  "CartItems"
    where "cartId" in (select "cartId" from "Cart" where "userId" = $1)
    returning *;
    `;
    const params = [req.user?.userId];
    const result = await db.query(sql, params);
    console.log('test');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.delete(
  '/api/delete-record/:recordId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const recordId = Number(req.params.recordId);
      const sql = 'DELETE FROM "Records" WHERE "recordId" = $1 RETURNING *';
      const params = [recordId];
      const result = await db.query(sql, params);
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/shop-by-genre/:genreId', async (req, res, next) => {
  try {
    const genreId = Number(req.params.genreId);
    const sql = `
  select *
  from "Records"
  where "genreId" = $1
    `;
    const params = [genreId];
    const result = await db.query(sql, params);
    if (!result.rows) {
      throw new ClientError(404, `Cannot find genre with genreId: ${genreId}`);
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/get-genre-ids', async (req, res, next) => {
  try {
    const sql = `SELECT "genreId", "name" FROM "Genres"`;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/get-genre-name/:genreId', async (req, res, next) => {
  try {
    const genreId = Number(req.params.genreId);
    const sql = `SELECT "name" FROM "Genres" WHERE "genreId" = $1`;
    const params = [genreId];
    const result = await db.query(sql, params);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

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
