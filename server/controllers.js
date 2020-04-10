const Models = require('../database/models/models.js');
const faker = require('faker');

const getRecs = (req, res) => {
  const params = [req.params.zip];
  Models.getRecs(params, (err, allRecommendations) => {
    if (err) {
      console.log('Error getting recommendations', err);
    } else {
      res.status(200).send(allRecommendations);
    }
  });
};

const addListing = (req, res) => {
  const uuid = faker.random.uuid();
  const listingData = req.body;

  Models.addListing(listingData, (err) => {
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
  addListing,
  updateListing,
  deleteListing
};
