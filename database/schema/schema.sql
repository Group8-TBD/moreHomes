DROP DATABASE IF EXISTS vincenthuang

CREATE DATABASE vincenthuang

\c vincenthuang

CREATE TABLE listings (
  id SERIAL,
  listing_url_id TEXT NOT NULL,
  occupancy VARCHAR(7) NOT NULL,
  type VARCHAR(20) NOT NULL,
  bed_count INTEGER NOT NULL,
  price INTEGER NOT NULL,
  timeframe VARCHAR(7) NOT NULL,
  avg_rtg DECIMAL(3, 2),
  num_reviews INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  zip VARCHAR(20) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE images (
  id SERIAL,
  image_url_id TEXT NOT NULL,
  description TEXT NOT NULL,
  listing INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (listing) REFERENCES listings(id)
);

\copy listings (url_id,occupancy,type,bed_count,price,timeframe,avg_rtg,num_reviews,description,zip) FROM '/Users/vincenthuang/git/hrsf126-sdc/moreHomesYouMayLike/database/generated_data/postgresListings.csv' WITH DELIMITER ',' CSV HEADER;
\copy images (url_id,description,listing) FROM '/Users/vincenthuang/git/hrsf126-sdc/moreHomesYouMayLike/database/generated_data/postgresImages.csv' WITH DELIMITER ',' CSV HEADER;
