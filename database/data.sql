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
insert into "Users" ("username", "hashedPassword")
values ('admin', '$argon2id$v=19$m=4096,t=3,p=1$s3cK24PPVDRr5865umJAbA$IEsjrPZ5DG/4zVWeiHsE3ilmdtY8CPawUUu533BhxbE');

-- Insert genres
insert into "Genres" ("name")
values
  ('alternative'),
  ('country'),
  ('electronic'),
  ('jazz'),
  ('pop'),
  ('rap'),
  ('reggae'),
  ('r&b'),
  ('rock'),
  ('spanish');

-- Insert sample records for the default user
insert into "Records" ("artist", "albumName", "genreId", "condition", "price", "info", "sellerId")
values
  ('The Beatles', 'Abbey Road', 9, 'Near Mint', 25, 'Classic rock album', 1),
  ('Miles Davis', 'Kind of Blue', 4, 'Very Good', 20, 'Jazz masterpiece', 1),
  ('Daft Punk', 'Random Access Memories', 3, 'Mint', 30, 'Electronic classic', 1),
  ('Johnny Cash', 'At Folsom Prison', 2, 'Good', 15, 'Live country album', 1),
  ('Radiohead', 'OK Computer', 1, 'Near Mint', 22, 'Alternative rock', 1);

-- Insert images from public folder (assuming /public/ is served statically)
insert into "Images" ("imageUrl", "recordId")
values
  ('/default-image.jpg', 1),    -- Abbey Road
  ('/default-image-2.jpg', 1),  -- Abbey Road
  ('/default-image.jpg', 2),    -- Kind of Blue
  ('/default-image-2.jpg', 2),  -- Kind of Blue
  ('/default-image.jpg', 3),    -- Random Access Memories
  ('/default-image-2.jpg', 3),  -- Random Access Memories
  ('/default-image.jpg', 4),    -- At Folsom Prison
  ('/default-image-2.jpg', 4),  -- At Folsom Prison
  ('/default-image.jpg', 5),    -- OK Computer
  ('/default-image-2.jpg', 5);  -- OK Computer