const Models = require('../database/models/models.js');
const faker = require('faker');

const munge = async (listing) => {
  try {
    let images = await Models.getImgs([listing.id]);
    let imageUrls = images.rows.map(imageId => `https://olympuscomponent.s3-us-west-1.amazonaws.com/${imageId.image_url_id}.jpg`);
    let responseObj = {
      "space": {
        "occupancy": listing.occupancy,
        "type": listing.type,
        "bedCount": listing.bed_count
      },
      "rate": {
        "price": listing.price,
        "timeframe": listing.timeframe
      },
      "review": {
        "stars": listing.avg_rtg,
        "reviewers": listing.num_reviews
      },
      "images": imageUrls,
      "_id": listing.id,
      'title': '',
      "description": listing.description
    };

    return responseObj;
  } catch (error) {
    console.log(error);
  }
}

const getRecs = async (req, res) => {
  try {
    const params = [req.params.zip];
    let data = [];
    let allRecs = await Models.getRecs(params);

    for (let i = 0; i < allRecs.rows.length; i += 1) {
      let listObj = await munge(allRecs.rows[i]);
      data.push(listObj);
    }

    res.status(200).send(data);

  } catch (error) {
    console.log('Error getting recommendations', error);
  }
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
