const db = require('../database.js');

const getRecs = (zip, callback) => {
  const queryStr = `SELECT id, occupancy, type, bed_count, price, timeframe, avg_rtg, num_reviews, description from listings where zip=$1 LIMIT 8`;
  db.query(queryStr, zip, callback);
};

const getImgs = (listingId, callback) => {
  const queryStr = `SELECT image_url_id FROM images WHERE listing=$1`
  db.query(queryStr, listingId, callback);
};

const addListing = (params, callback) => {
  const queryStr = `INSERT INTO listings (listing_url_id, occupancy, type, bed_count, price, timeframe, avg_rtg, num_reviews, description, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
  db.query(queryStr, params, callback);
};

const updateListing = (id, fields, callback) => {
  let updateStr = ``;
  for (let i = 0; i < fields.length; i += 2) {
    updateStr += `$${i}=$${i + 1}`
  }
  const queryStr = `UPDATE listings SET ${updateStr} WHERE id=${id};`;
  db.query(queryStr, fields, callback);
};

const deleteListing = (id, callback) => {
  const queryStr = `DELETE FROM listings WHERE id=${id};
    DELETE FROM images WHERE listing=${id};`;
  db.query(queryStr, callback);
};

module.exports = {
  getRecs,
  getImgs,
  addListing,
  updateListing,
  deleteListing
};
