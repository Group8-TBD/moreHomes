const mongoose = require('mongoose');
var dbName = 'recommendations'

//-------------establish connection---------------------
mongoose.connect(`mongodb://localhost/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once("open", function() {
console.log("*** MongoDB connected ***");
console.log(`Our Current Database Name : ${connection.db.databaseName}`);
});
//------------------------------------------------------
//import model
const { Casa } = require('./calls');

//___________generates fakes______
var faker = require('faker');
//________________________________


//populate the database with 100 random entries with id's 1 - 100
//_________________________________________________

handleError = function(err) {

  console.log('\n');
  console.log('Database error log below:');
  console.log('\n');
  console.error(err);
  console.log('\n');
  throw new Error('full database population and/or re-seeding failed.\n');

}

randomImage = function() {

  var x = 6; //this is the number of images per home object that will be seeded (random)
  let padToThree = number => number <= 999 ? `00${number}`.slice(-3) : number; //fancy es6 zero padding function

  var imageRandom = Math.floor(Math.random() * 188); //this integer is the number of items in an AWS bucket
  var url = 'https://olympuscomponent.s3-us-west-1.amazonaws.com/';
  var image = url + padToThree(imageRandom) + '.jpg';

  return image;
}

// test images
// var image1 = 'https://cdn1.artstation.com/p/assets/images/images/001/139/545/large/liam-reid-liam-reid-hackerroom.jpg?1440869455';
// var image2 = 'https://cdnb.artstation.com/p/assets/images/images/004/991/311/medium/adrian-marc-amarc-cyberoom-v3.jpg?1487708427';
// var image3 = 'https://cdna.artstation.com/p/assets/images/images/009/687/364/large/tony-setiabudi-jadi-final0000.jpg?1520345288';

populate = function() {

  //drop database for re-seeding
  connection.once("open", function() {
    mongoose.connection.db.dropDatabase(
    console.log(`clearing current entries`)
    );
  });

  for (var i = 1; i < 105; i++) {

    //defining type of rental for type of space
    var spaceTypes = ['entire', 'private', 'shared'];
    var occRandom = Math.floor(Math.random() * 3);
    var occupancyType = spaceTypes[occRandom];
    //_________________________________________________

    //defining timeframe for clarity
    var timeTypes = ['nightly', 'weekly', 'monthly'];
    var timeRandom = Math.floor(Math.random() * 3);
    var timeframeType = timeTypes[timeRandom];
    //_________________________________________________

    //defining timeframe for clarity
    var locTypes = ['house', 'apartment', 'villa', 'condo', 'squat', 'tech palace'];
    var locRandom = Math.floor(Math.random() * 6);
    var locType = locTypes[locRandom];
    //_________________________________________________

    var casa = new Casa({
      index: i,
      title: faker.lorem.sentence(),
      space: {
        occupancy: occupancyType,
        type: locType,
        bedCount: faker.random.number($nbDigits = 9, $strict = true)
      },
      rate: {
        price: faker.random.number($nbDigits = 799, $strict = true),
        timeframe: timeframeType
      },
      review: {
        stars: faker.finance.amount(0, 5, 1),
        reviewers: faker.random.number($nbDigits = 2000, $strict = true)
      },
      description: faker.hacker.phrase(),
      images: [randomImage(), randomImage(), randomImage(), randomImage(), randomImage(), randomImage()]
    });

    casa.save(function (err) {
      if (err) {
        return handleError(err);
      }
    });
  }

  //gives time to throw error and stop process
  setTimeout(() => {
    console.log('database seeded.');
    process.exit();
  }, 2000);

};

populate();
