// Core Dependencies
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import stripe from 'stripe';
// Middleware and Utilities
import {
  ClientError,
  authMiddleware,
  errorMiddleware,
  uploadsMiddleware,
} from './lib/index.js';
import cors from 'cors';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { DatabaseError } from 'pg-protocol';
import { createClient } from '@supabase/supabase-js';
dotenv.config();
// Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://record-marketplace.onrender.com',
  'https://record-marketplace.vercel.app',
  'https://aa47-76-50-84-138.ngrok-free.app',
];
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not found in env');
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided in .env');
}
// Database Setup
const db = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
// Express App Setup
const app = express();
// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
// Middleware
app.use(express.json());
const uploadsStaticDir = new URL('public', import.meta.url).pathname;
app.use(express.static(uploadsStaticDir));
// Stripe
// eslint-disable-next-line new-cap
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY ?? '');
const orderData = new Map(); // Temporary in-memory storage
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
  // eslint-disable-next-line camelcase
  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.artist} - ${item.albumName}`,
        images: item.images ? [item.images[0]] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: 1,
  }));
  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      // eslint-disable-next-line camelcase
      line_items,
      mode: 'payment',
      success_url: `${process.env.YOUR_DOMAIN}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/checkout`,
      shipping_address_collection: { allowed_countries: ['US', 'CA'] }, // Confirm this is present
    });
    orderData.set(session.id, { cartItems });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: errorMessage,
    });
  }
});
app.get('/api/confirm-order', async (req, res) => {
  const sessionId = req.query.session_id;
  try {
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const data = orderData.get(sessionId);
      if (data) {
        const customerEmail = session.customer_details?.email;
        const shippingAddress = session.shipping_details?.address;
        const purchasedItems = data.cartItems;
        const subtotal = purchasedItems
          .reduce((acc, item) => acc + Number(item.price), 0)
          .toFixed(2);
        const salesTax = Number((Number(subtotal) * 0.0725).toFixed(2));
        const totalPrice = (Number(subtotal) + salesTax).toFixed(2);
        // Start a transaction
        await db.query('BEGIN');
        // Delete purchased items from Records
        for (const item of purchasedItems) {
          const deleteSql = `
            DELETE FROM "Records"
            WHERE "recordId" = $1
            RETURNING *
          `;
          const deleteParams = [item.recordId];
          const deleteResult = await db.query(deleteSql, deleteParams);
          if (deleteResult.rowCount === 0) {
            throw new Error(`Record ${item.recordId} not found`);
          }
          // Optionally record the transaction
          const transactionSql = `
            INSERT INTO "Transactions" ("buyerId", "recordId", "totalPrice", "transactionDate")
            VALUES ($1, $2, $3, NOW())
            RETURNING *
          `;
          const buyerId = item.userId || null; // Adjust if you can get buyerId from session
          const transactionParams = [buyerId, item.recordId, item.price];
          await db.query(transactionSql, transactionParams);
        }
        // Commit the transaction
        await db.query('COMMIT');
        res.json({
          success: true,
          order: {
            purchasedItems,
            customerEmail,
            shippingAddress,
            subtotal,
            salesTax,
            totalPrice,
          },
        });
        orderData.delete(sessionId);
      } else {
        res
          .status(404)
          .json({ success: false, message: 'Order not found in local data' });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error retrieving session or deleting items:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: `Error: ${errorMessage}` });
  }
});
// Authentication Routes
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
      select "userId", "hashedPassword"
      from "Users"
      where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, `User: ${username} does not exist`);
    }
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
  } catch (error) {
    next(error);
  }
});
// Listing Routes
app.post(
  '/api/create-listing',
  authMiddleware,
  uploadsMiddleware.array('images', 4),
  async (req, res) => {
    try {
      const { artist, album, genre, condition, price, info } = req.body;
      const files = req.files;
      if (!req.user?.userId) {
        throw new Error('Unauthorized: No user ID found');
      }
      const supabase = createClient(
        process.env.SUPABASE_URL || 'https://lvgmwasaitkgaugklrqb.supabase.co',
        process.env.SUPABASE_KEY || 'your-anon-key'
      );
      const genreSql = `
        SELECT "genreId" 
        FROM "Genres" 
        WHERE "name" = $1
      `;
      const genreResult = await db.query(genreSql, [genre]);
      if (!genreResult.rows[0]) {
        throw new Error(`Genre '${genre}' not found'`);
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
        Number(price),
        info,
        req.user.userId,
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
          const fileName = `${Date.now()}-${file.originalname}`;
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
            });
          if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
          const { data } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);
          const publicUrl = data.publicUrl;
          const imageParams = [publicUrl, listing.recordId];
          await db.query(imageSql, imageParams); // Removed unused imageResult
        }
      }
      res.status(201).json(listing);
    } catch (error) {
      // Changed to unknown
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'an unexpected error occurred',
        message: errorMessage,
      });
    }
  }
);
app.put(
  '/api/update-listing/:recordId',
  authMiddleware,
  uploadsMiddleware.array('images', 4),
  async (req, res, next) => {
    try {
      const { recordId } = req.params;
      const id = Number(recordId);
      const { artist, album, genre, condition, price, info } = req.body;
      const files = req.files;
      const supabase = createClient(
        process.env.SUPABASE_URL || 'https://lvgmwasaitkgaugklrqb.supabase.co',
        process.env.SUPABASE_KEY || 'your-anon-key'
      );
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
      if (files.length > 0) {
        const existingImagesSql = `
          SELECT "imageUrl"
          FROM "Images"
          WHERE "recordId" = $1
        `;
        const existingImagesResult = await db.query(existingImagesSql, [id]);
        const oldImageUrls = existingImagesResult.rows.map(
          (row) => row.imageUrl
        );
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
          const fileName = `${Date.now()}-${file.originalname}`;
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
            });
          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }
          const { data } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);
          const publicUrl = data.publicUrl;
          const imageResult = await db.query(imageSql, [publicUrl, id]);
          images.push(imageResult.rows[0].imageUrl);
        }
        for (const url of oldImageUrls) {
          const fileName = url.split('/').pop();
          if (fileName) {
            const { error: deleteError } = await supabase.storage
              .from('images')
              .remove([fileName]);
            if (deleteError) {
              // Silently ignore delete errors for now
            }
          }
        }
      } else {
        const existingImagesSql = `
          SELECT "imageUrl"
          FROM "Images"
          WHERE "recordId" = $1
        `;
        const existingImagesResult = await db.query(existingImagesSql, [id]);
        images = existingImagesResult.rows.map((row) => row.imageUrl);
      }
      res.status(200).json({ ...listing, images });
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
app.delete(
  '/api/delete-record/:recordId',
  authMiddleware,
  async (req, res, next) => {
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
        throw new ClientError(
          404,
          `Record with recordId ${recordId} not found or not owned by user`
        );
      }
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
    } catch (error) {
      next(error);
    }
  }
);
// Product Routes
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
      conditions.push(
        `("Records"."albumName" ILIKE $${
          params.length + 1
        } OR "Records"."artist" ILIKE $${params.length + 1})`
      );
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
  } catch (error) {
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
  } catch (error) {
    next(error);
  }
});
// Genre Routes
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
      conditions.push(
        `("Records"."albumName" ILIKE $${
          params.length + 1
        } OR "Records"."artist" ILIKE $${params.length + 1})`
      );
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
    res.status(200).json(result.rows);
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
// Cart Routes
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
  } catch (error) {
    next(error);
  }
});
app.get('/api/cart', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID not available in request');
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
  } catch (error) {
    next(error);
  }
});
// Purchase Routes
app.post('/api/purchase', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ClientError(401, 'User ID not available');
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
      const transactionSql = `
        INSERT INTO "Transactions" ("buyerId", "recordId", "totalPrice", "transactionDate")
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      const transactionParams = [userId, recordId, price];
      const transactionResult = await db.query(
        transactionSql,
        transactionParams
      );
      purchasedItems.push(transactionResult.rows[0]);
    }
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
  } catch (error) {
    await db.query('ROLLBACK');
    next(error);
  }
});
// Error Handling and Server Start
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
