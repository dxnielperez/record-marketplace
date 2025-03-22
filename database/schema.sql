set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "username" text unique,
  "hashedPassword" text,
  "createdAt" timestamptz default now()
);

CREATE TABLE "Records" (
  "recordId" serial PRIMARY KEY,
  "artist" text,
  "albumName" text,
  "genreId" integer,
  "condition" text,
  "price" integer,
  "info" text,
  "sellerId" integer
);

CREATE TABLE "Genres" (
  "genreId" serial PRIMARY KEY,
  "name" text
);

CREATE TABLE "Transactions" (
  "transactionId" serial PRIMARY KEY,
  "buyerId" integer,
  "recordId" integer,
  "totalPrice" integer,
  "transactionDate" timestamptz
);

CREATE TABLE "Cart" (
  "cartId" serial PRIMARY KEY,
  "userId" integer
);

CREATE TABLE "CartItems" (
  "itemsId" serial PRIMARY KEY,
  "cartId" integer,
  "recordId" integer,
  "quantity" integer
);

CREATE TABLE "Images" (
  "imageId" serial PRIMARY KEY,
  "imageUrl" text,
  "recordId" integer
);

-- Add foreign key constraints
ALTER TABLE "Records" 
  ADD FOREIGN KEY ("genreId") REFERENCES "Genres" ("genreId"),
  ADD FOREIGN KEY ("sellerId") REFERENCES "Users" ("userId");

ALTER TABLE "Transactions" 
  ADD FOREIGN KEY ("buyerId") REFERENCES "Users" ("userId"),
  ADD FOREIGN KEY ("recordId") REFERENCES "Records" ("recordId");

ALTER TABLE "Cart" 
  ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "CartItems" 
  ADD FOREIGN KEY ("cartId") REFERENCES "Cart" ("cartId"),
  ADD FOREIGN KEY ("recordId") REFERENCES "Records" ("recordId") ON DELETE CASCADE;

ALTER TABLE "Images" 
  ADD FOREIGN KEY ("recordId") REFERENCES "Records" ("recordId") ON DELETE CASCADE;