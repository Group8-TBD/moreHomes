const Models = require('../database/models/models.js');
const faker = require('faker');

const getRecs = (req, res) => {
  Models.getRecs([req.params.zip], (err, allRecs) => {
    if (err) {
      console.log('Error getting listing info', err);
    } else {
      res.status(200).send(allRecs.rows);
    }
  });
};

const getImgs = (req, res) => {
  Models.getImgs([req.params.id], (err, allImgs) => {
    if (err) {
      console.log('Error getting image info', err);
    } else {
      res.status(200).send(allImgs.rows);
    }
  });
}

const addListing = (req, res) => {
  const uuid = faker.random.uuid();
  const listingData = req.body;

  const params = [
    uuid,
    listingData.occupancy,
    listingData.type,
    listingData.bedCount,
    listingData.price,
    listingData.timeframe,
    listingData.description,
    listingData.zip
  ];

  Models.addListing(params, (err) => {
    if (err) {
      console.log('Error adding listing', err);
    } else {
      res.status(201);
    }
  });
};

const updateListing = (req, res) => {
  const updateData = req.body;
  const id = req.params.id;

  Models.updateListing(id, updateData, (err) => {
    if (err) {
      console.log('Error updating listing', err);
    } else {
      res.status(200);
    }
  });
};

const deleteListing = (req, res) => {
  const id = req.params.id;

  Models.deleteListing(id, (err) => {
    if (err) {
      console.log('Error deleting listing', err);
    } else {
      res.status(200);
    }
  });
};

module.exports = {
  getRecs,
  getImgs,
  addListing,
  updateListing,
  deleteListing
};
