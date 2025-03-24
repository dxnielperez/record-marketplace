/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, authMiddleware, errorMiddleware, uploadsMiddleware, } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { DatabaseError } from 'pg-protocol';
import cors from 'cors';
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
    throw new Error('DATABASE_URL not found in env');
const db = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey)
    throw new Error('TOKEN_SECRET not found in .env');
const app = express();
app.use(cors({ origin: 'https://record-marketplace.vercel.app' }));
app.use(express.json());
// Create paths for static directories
// const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;
// app.use(express.static(reactStaticDir));
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
    }
    catch (error) {
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
      select "userId", "hashedPassword"
      from "Users"
      where "username" = $1
    `;
        const params = [username];
        const result = await db.query(sql, params);
        const [user] = result.rows;
        if (!user) {
            throw new ClientError(401, `User: ${username} does not exist`); // Fixed user reference
        }
        const { userId, hashedPassword } = user;
        if (!(await argon2.verify(hashedPassword, password))) {
            throw new ClientError(401, 'invalid login');
        }
        const payload = { userId, username };
        const hashKey = process.env.TOKEN_SECRET ?? '';
        if (!hashKey)
            throw new Error('TOKEN_SECRET not found in env');
        const token = jwt.sign(payload, hashKey);
        res.json({ token, user: payload });
    }
    catch (error) {
        next(error);
    }
});
app.post('/api/create-listing', authMiddleware, uploadsMiddleware.array('images', 4), async (req, res, next) => {
    try {
        const { artist, album, genre, condition, price, info } = req.body;
        const files = req.files;
        const genreSql = `
        SELECT "genreId" 
        FROM "Genres" 
        WHERE "name" = $1
      `;
        const genreResult = await db.query(genreSql, [genre]);
        if (!genreResult.rows[0]) {
            throw new ClientError(400, `Genre '${genre}' not found`);
        }
        const genreId = genreResult.rows[0].genreId;
        const recordSql = `
        INSERT INTO "Records" ("artist", "albumName", "genreId", "condition", "price", "info", "sellerId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
        const recordParams = [
            artist,
            album,
            genreId,
            condition,
            price,
            info,
            req.user?.userId,
        ];
        const recordResult = await db.query(recordSql, recordParams);
        const listing = recordResult.rows[0];
        if (files && files.length > 0) {
            const imageSql = `
          INSERT INTO "Images" ("imageUrl", "recordId")
          VALUES ($1, $2)
          RETURNING *;
        `;
            for (const file of files) {
                const imageParams = [`/images/${file.filename}`, listing.recordId];
                await db.query(imageSql, imageParams);
            }
        }
        res.status(201).json(listing);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/get-genres', async (req, res, next) => {
    try {
        const sql = `
    select * from "Genres"
    `;
        const result = await db.query(sql);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/all-products', async (req, res, next) => {
    try {
        const { search, artist, album, genre } = req.query;
        let sql = `
      SELECT "Records".*,
             "Genres"."name" AS "genre",
             (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
      FROM "Records"
      JOIN "Genres" USING ("genreId")
    `;
        const params = [];
        const conditions = [];
        if (search) {
            conditions.push(`("Records"."albumName" ILIKE $${params.length + 1} 
        OR "Records"."artist" ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }
        if (artist) {
            conditions.push(`"Records"."artist" ILIKE $${params.length + 1}`);
            params.push(`%${artist}%`);
        }
        if (album) {
            conditions.push(`"Records"."albumName" ILIKE $${params.length + 1}`);
            params.push(`%${album}%`);
        }
        if (genre) {
            conditions.push(`"Genres"."name" ILIKE $${params.length + 1}`);
            params.push(`%${genre}%`);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }
        const result = await db.query(sql, params);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/get-images/:recordId', async (req, res, next) => {
    try {
        const recordId = Number(req.params.recordId);
        const sql = `
      SELECT "imageUrl"
      FROM "Images"
      WHERE "recordId" = $1
    `;
        const params = [recordId];
        const result = await db.query(sql, params);
        res.json(result.rows.map((row) => row.imageUrl));
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/products/:record', async (req, res, next) => {
    try {
        const record = req.params.record;
        const parts = record.split('+');
        if (parts.length !== 2) {
            throw new ClientError(400, 'Invalid format. Expected /products/name+id');
        }
        const recordId = Number(parts[1]);
        if (!recordId || isNaN(recordId)) {
            throw new ClientError(400, 'recordId must be a positive integer');
        }
        const sql = `
   SELECT "recordId",
       "artist",
       "albumName",
       "genreId",
       "condition",
       "price",
       "info",
       "sellerId",
       "Genres"."name" AS "genre",
       (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
FROM "Records"
JOIN "Genres" USING ("genreId")
WHERE "recordId" = $1
    `;
        const params = [recordId];
        const result = await db.query(sql, params);
        if (!result.rows[0]) {
            throw new ClientError(404, `Cannot find record with recordId: ${recordId}`);
        }
        res.json(result.rows[0]);
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
app.post('/api/cart/add', authMiddleware, async (req, res, next) => {
    try {
        const { recordId } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('User ID not available in request');
        }
        const checkCartSql = `
      SELECT * FROM "Cart" WHERE "userId" = $1
    `;
        const checkCartParams = [userId];
        const checkCartResult = await db.query(checkCartSql, checkCartParams);
        if (checkCartResult.rowCount === 0) {
            const createCartSql = `
        INSERT INTO "Cart" ("userId") VALUES ($1) RETURNING *;
      `;
            const createCartParams = [userId];
            await db.query(createCartSql, createCartParams);
        }
        const sql = `
      INSERT INTO "CartItems" ("cartId", "recordId", "quantity")
      SELECT "cartId", $2, 1
      FROM "Cart"
      WHERE "userId" = $1
      RETURNING *;
    `;
        const params = [userId, recordId];
        const result = await db.query(sql, params);
        const cart = result.rows[0];
        const readProduct = `
      SELECT "recordId",
             "artist",
             "albumName",
             "genreId",
             "condition",
             "price",
             "info",
             "sellerId",
             "Genres"."name" AS "genre",
             (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
      FROM "Records"
      JOIN "Genres" USING ("genreId")
      WHERE "recordId" = $1
    `;
        const productParams = [recordId];
        const productResult = await db.query(readProduct, productParams);
        res.status(201).json({ ...productResult.rows[0], itemsId: cart.itemsId });
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/cart', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            throw new Error('User ID not available in request');
        const sql = `
      SELECT "Cart".*,
             "CartItems".*,
             "Records"."recordId",
             "Records"."artist",
             "Records"."albumName",
             "Records"."genreId",
             "Records"."condition",
             "Records"."price",
             "Records"."info",
             "Records"."sellerId",
             "Genres"."name" AS "genre",
             (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
      FROM "Cart"
      JOIN "CartItems" USING ("cartId")
      JOIN "Records" USING ("recordId")
      JOIN "Genres" USING ("genreId")
      WHERE "userId" = $1
    `;
        const params = [userId];
        const result = await db.query(sql, params);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
app.delete('/api/cart/remove/:itemsId', authMiddleware, async (req, res, next) => {
    try {
        const { itemsId } = req.params;
        const id = Number(itemsId);
        if (typeof id !== 'number') {
            throw new ClientError(400, 'RecordId must be a number');
        }
        const userId = req.user?.userId;
        if (!userId)
            throw new Error('User ID not available in request');
        const sql = `
    delete from "CartItems"
    where "itemsId" = $1
    returning *;
    `;
        const params = [id];
        const result = await db.query(sql, params);
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/active-listings/:userId', authMiddleware, async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const sql = `
        SELECT "Records".*,
               "Genres"."name" AS "genre",
               (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
        FROM "Records"
        JOIN "Users" ON "Records"."sellerId" = "Users"."userId"
        JOIN "Genres" USING ("genreId")
        WHERE "Users"."userId" = $1
      `;
        const params = [userId];
        const result = await db.query(sql, params);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
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
    }
    catch (error) {
        if (error instanceof DatabaseError && error.code === '23503') {
            next(new ClientError(421, 'Cant delete item in someones cart'));
        }
        else {
            next(error);
        }
    }
});
app.put('/api/update-listing/:recordId', authMiddleware, uploadsMiddleware.array('images', 4), async (req, res, next) => {
    try {
        const { recordId } = req.params;
        const id = Number(recordId);
        const { artist, album, genre, condition, price, info } = req.body;
        const files = req.files;
        const genreSql = `
        SELECT "genreId" 
        FROM "Genres" 
        WHERE "name" = $1
      `;
        const genreResult = await db.query(genreSql, [genre]);
        if (!genreResult.rows[0]) {
            throw new ClientError(400, `Genre '${genre}' not found`);
        }
        const genreId = genreResult.rows[0].genreId;
        const recordSql = `
        UPDATE "Records"
        SET "artist" = $1,
            "albumName" = $2,
            "genreId" = $3,
            "condition" = $4,
            "price" = $5,
            "info" = $6
        WHERE "recordId" = $7
        RETURNING *;
      `;
        const recordParams = [artist, album, genreId, condition, price, info, id];
        const recordResult = await db.query(recordSql, recordParams);
        const listing = recordResult.rows[0];
        let images = [];
        if (files && files.length > 0) {
            const deleteImagesSql = `
          DELETE FROM "Images"
          WHERE "recordId" = $1
        `;
            await db.query(deleteImagesSql, [id]);
            const imageSql = `
          INSERT INTO "Images" ("imageUrl", "recordId")
          VALUES ($1, $2)
          RETURNING "imageUrl";
        `;
            for (const file of files) {
                const imageParams = [`/images/${file.filename}`, id];
                const imageResult = await db.query(imageSql, imageParams);
                images.push(imageResult.rows[0].imageUrl);
            }
        }
        else {
            // If no new images uploaded, fetch existing images
            const existingImagesSql = `
          SELECT "imageUrl"
          FROM "Images"
          WHERE "recordId" = $1
        `;
            const existingImagesResult = await db.query(existingImagesSql, [id]);
            images = existingImagesResult.rows.map((row) => row.imageUrl);
        }
        res.status(200).json({ ...listing, images });
    }
    catch (error) {
        next(error);
    }
});
app.delete('/api/cart/all/:userId', authMiddleware, async (req, res, next) => {
    try {
        const sql = `
    delete from  "CartItems"
    where "cartId" in (select "cartId" from "Cart" where "userId" = $1)
    returning *;
    `;
        const params = [req.user?.userId];
        const result = await db.query(sql, params);
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
});
app.delete('/api/delete-record/:recordId', authMiddleware, async (req, res, next) => {
    try {
        const recordId = Number(req.params.recordId);
        if (isNaN(recordId) || recordId <= 0) {
            throw new ClientError(400, 'recordId must be a positive integer');
        }
        const sql = `
        DELETE FROM "Records"
        WHERE "recordId" = $1 AND "sellerId" = $2
        RETURNING *
      `;
        const params = [recordId, req.user?.userId];
        const result = await db.query(sql, params);
        if (result.rows.length === 0) {
            throw new ClientError(404, `Record with recordId ${recordId} not found or not owned by user`);
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/shop-by-genre/:genreName', async (req, res, next) => {
    try {
        const { search, artist, album, genre } = req.query;
        const genreName = req.params.genreName;
        let sql = `
      SELECT "Records".*,
             "Genres"."name" AS "genre",
             (SELECT array_agg("imageUrl") FROM "Images" WHERE "Images"."recordId" = "Records"."recordId") AS "images"
      FROM "Records"
      JOIN "Genres" USING ("genreId")
    `;
        const params = [];
        const conditions = [];
        conditions.push(`"Genres"."name" = $${params.length + 1}`);
        params.push(genreName);
        if (search) {
            conditions.push(`("Records"."albumName" ILIKE $${params.length + 1} 
        OR "Records"."artist" ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }
        if (artist) {
            conditions.push(`"Records"."artist" ILIKE $${params.length + 1}`);
            params.push(`%${artist}%`);
        }
        if (album) {
            conditions.push(`"Records"."albumName" ILIKE $${params.length + 1}`);
            params.push(`%${album}%`);
        }
        if (genre) {
            conditions.push(`"Genres"."name" ILIKE $${params.length + 1}`);
            params.push(`%${genre}%`);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }
        const result = await db.query(sql, params);
        res.status(200).json(result.rows); // Always return 200 with rows (empty or not)
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/get-genre-ids', async (req, res, next) => {
    try {
        const sql = `SELECT "genreId", "name" FROM "Genres"`;
        const result = await db.query(sql);
        res.json(result.rows);
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
app.post('/api/sign-in-guest', async (req, res, next) => {
    try {
        const username = 'guest_' + Math.floor(Math.random() * 100000);
        const password = 'guest_password';
        const hashedPassword = await argon2.hash(password);
        const sql = `
    insert into "Users" ("username", "hashedPassword")
    values($1, $2)
    returning *;
    `;
        const params = [username, hashedPassword];
        const result = await db.query(sql, params);
        const guestUserId = result.rows[0].userId;
        const payload = { userId: guestUserId, username };
        const token = jwt.sign(payload, hashKey);
        res.json({ token, user: payload });
    }
    catch (error) {
        next(error);
    }
});
app.post('/api/purchase', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            throw new ClientError(401, 'User ID not available');
        const cartSql = `
      SELECT "CartItems"."recordId", "Records"."sellerId", "Records"."price"
      FROM "CartItems"
      JOIN "Cart" USING ("cartId")
      JOIN "Records" USING ("recordId")
      WHERE "Cart"."userId" = $1
    `;
        const cartParams = [userId];
        const cartResult = await db.query(cartSql, cartParams);
        const cartItems = cartResult.rows;
        if (cartItems.length === 0) {
            throw new ClientError(400, 'Cart is empty');
        }
        await db.query('BEGIN');
        const purchasedItems = [];
        for (const item of cartItems) {
            const { recordId, price } = item;
            // Delete the record from Records first
            const deleteRecordSql = `
        DELETE FROM "Records"
        WHERE "recordId" = $1
        RETURNING *
      `;
            const deleteRecordParams = [recordId];
            const deleteResult = await db.query(deleteRecordSql, deleteRecordParams);
            if (deleteResult.rowCount === 0) {
                throw new ClientError(404, `Record ${recordId} not found`);
            }
            // Insert into Transactions after deletion
            const transactionSql = `
        INSERT INTO "Transactions" ("buyerId", "recordId", "totalPrice", "transactionDate")
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
            const transactionParams = [userId, recordId, price];
            const transactionResult = await db.query(transactionSql, transactionParams);
            purchasedItems.push(transactionResult.rows[0]);
        }
        // Clear the cart
        const clearCartSql = `
      DELETE FROM "CartItems"
      WHERE "cartId" IN (SELECT "cartId" FROM "Cart" WHERE "userId" = $1)
    `;
        await db.query(clearCartSql, [userId]);
        await db.query('COMMIT');
        res.status(200).json({
            message: 'Purchase completed successfully',
            purchasedItems,
        });
    }
    catch (error) {
        await db.query('ROLLBACK');
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
// app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
