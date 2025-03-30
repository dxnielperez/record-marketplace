-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);


-- Insert default data
-- Default user with argon2 hashed password for "perez"
INSERT INTO "Users" ("username", "hashedPassword", "isAdmin")
VALUES ('admin', '$argon2id$v=19$m=4096,t=3,p=1$s3cK24PPVDRr5865umJAbA$IEsjrPZ5DG/4zVWeiHsE3ilmdtY8CPawUUu533BhxbE', true);

-- Insert genres
insert into "Genres" ("name")
values
  ('alternative'), --1
  ('country'), --2
  ('electronic'), --3
  ('jazz'), --4
  ('pop'), --5
  ('rap'), --6
  ('reggae'), --7
  ('r&b'), --8
  ('rock'), --9
  ('spanish'); --10

-- Insert sample records for the default user
insert into "Records" ("artist", "albumName", "genreId", "condition", "price", "info", "sellerId")
values
  ('The Beatles', 'Abbey Road', 9, 'Near Mint', 35.00, 'Iconic 1969 rock album with pristine vinyl, light sleeve wear', 1),
  ('Miles Davis', 'Kind of Blue', 4, 'Very Good Plus', 28.50, 'Timeless jazz masterpiece, minor surface noise, well-preserved cover', 1),
  ('Daft Punk', 'Random Access Memories', 3, 'Mint', 40.00, 'Flawless electronic gem from 2013, unopened in original shrink wrap', 1),
  ('Johnny Cash', 'At Folsom Prison', 2, 'Good', 18.75, 'Raw live country recording, some scratches but plays through, worn sleeve', 1),
  ('Radiohead', 'OK Computer', 1, 'Near Mint', 32.00, 'Groundbreaking alternative rock LP, barely played, crisp artwork', 1),
  ('George Harrison', 'All Things Must Pass', 9, 'Very Good', 25.99, 'Triple-LP rock classic, light scuffs, box set intact with posters', 1),
  ('Mac Miller', 'Faces', 6, 'Excellent', 55.00, 'Rare rap mixtape pressing, excellent sound quality, minimal wear', 1),
  ('Tribal Seeds', 'The Harvest', 7, 'Good Plus', 29.95, 'Roots reggae vibes, slight crackle on quiet parts, solid jacket', 1),
  ('Mac Miller', 'K.I.D.S', 6, 'Very Good', 38.50, 'Early rap release, clean vinyl with faint marks, sleeve slightly creased', 1),
  ('Rebelution', 'Peace of Mind', 7, 'Near Mint', 34.99, 'Smooth reggae album, near-perfect condition, includes original inserts', 1),
  ('Kid Cudi', 'Man on the Moon: End of Day', 6, 'Good', 27.00, 'Influential rap debut, moderate wear but fully playable, faded cover', 1),
  ('Kanye West', 'My Beautiful Dark Twisted Fantasy', 6, 'Mint', 60.00, 'Epic rap masterpiece, factory-sealed with hype sticker, collectors item', 1);

-- Insert images from public folder (assuming /public/ is served statically)
insert into "Images" ("imageUrl", "recordId")
values
  ('/albums/abbey-road.webp', 1),
  ('/default-image-2.jpg', 1),
  ('/albums/kind-of-blue.jpg', 2),
  ('/default-image-2.jpg', 2),
  ('/albums/random-access.jpg', 3),
  ('/default-image-2.jpg', 3),
  ('/albums/folsom.jpeg', 4),
  ('/default-image-2.jpg', 4),
  ('/albums/ok-computer.webp', 5),
  ('/default-image-2.jpg', 5),
  ('/albums/all-things-must-pass.webp', 6),
  ('/default-image-2.jpg', 6),
  ('/albums/faces.jpeg', 7),
  ('/default-image-2.jpg', 7),
  ('/albums/harvest.jpg', 8),
  ('/default-image-2.jpg', 8),
  ('/albums/kicking.jpeg', 9),
  ('/default-image-2.jpg', 9),
  ('/albums/peace.jpg', 10),
  ('/default-image-2.jpg', 10),
  ('/albums/motm.jpg', 11),
  ('/default-image-2.jpg', 11),
  ('/albums/mbdtf.jpg', 12),
  ('/default-image-2.jpg', 12);   -- <-- No semicolon before this line
