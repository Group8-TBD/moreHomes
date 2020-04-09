const db = require('../database.js');

const getRecs = (zip, callback) => {
  const queryStr = 'SELECT * from listings, images WHERE images.listing=listings.id AND listings.id=?;'
  db.query(queryStr, zip, callback);
};

const addListing = (params, callback) => {
  const queryStr = 'INSERT INTO listings (listing_url_id, occupancy, type, bed_count, price, timeframe, avg_rtg, num_reviews, description, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  db.query(queryStr, params, callback);
};

const updateListing = (id, fields, callback) => {
  const queryStr = `UPDATE listings SET ? WHERE id=${id};`;
  db.query(queryStr, fields, callback);
};

const deleteListing = (id, callback) => {
  const queryStr = `DELETE FROM listings WHERE id=${id};
    DELETE FROM images WHERE listing=${id};`;
  db.query(queryStr, callback);
};

module.exports = {
  getRecs,
  addListing,
  updateListing,
  deleteListing
};
