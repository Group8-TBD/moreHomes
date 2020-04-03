const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker');
const path = require('path');
const cliProgress = require('cli-progress');

const listingsWriter = createCsvWriter({
  path: path.join(__dirname, 'postgresListings.csv'),
  header: [
    { id: 'url', title: 'URL' },
    { id: 'occ', title: 'OCCUPANCY' },
    { id: 'type', title: 'TYPE' },
    { id: 'beds', title: 'BED_COUNT' },
    { id: 'price', title: 'PRICE' },
    { id: 'time', title: 'TIMEFRAME' },
    { id: 'rtg', title: 'AVG_RTG' },
    { id: 'reviews', title: 'NUM_REVIEWS' },
    { id: 'descr', title: 'DESCRIPTION' },
    { id: 'zip', title: 'ZIP'},
  ]
});

const imagesWriter = createCsvWriter({
  path: path.join(__dirname, 'postgresImages.csv'),
  header: [
    { id: 'url', title: 'URL' },
    { id: 'descr', title: 'DESCRIPTION' },
    { id: 'list', title: 'LISTING' },
  ]
});

const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true
}, cliProgress.Presets.shades_classic);

const randomImage = () => {

  const x = 6; //this is the number of images per home object that will be seeded (random)
  let padToThree = number => number <= 999 ? `00${number}`.slice(-3) : number; //fancy es6 zero padding function

  const imageRandom = Math.floor(Math.random() * 188); //this integer is the number of items in an AWS bucket
  const url = 'https://olympuscomponent.s3-us-west-1.amazonaws.com/';
  const image = url + padToThree(imageRandom) + '.jpg';

  return image;
}

// all possibilities for 'occupancy', 'types', and 'timeframe' fields
const allOccup = ['entire', 'private', 'shared'];
const allTypes = ['house', 'apartment', 'villa', 'condo', 'squat', 'tech palace'];
const allTimes = ['nightly', 'weekly', 'monthly'];

/**
 * Returns a random integer between min and max
 *
 * @param {number || array} max If provided a number, will generate a random integer up to that number.
 * If provided an array, will generate a random index up to the array's last index.
 * @param {number} min OPTIONAL If provided, will set the lowest possible return value. If undefined, will default to zero.
 * @return {number} Random integer between minimum and maximum.
 */

const randomInt = (max, min) => {
  if (!min) {
    min = 0;
  }

  if (Array.isArray(max)) {
    return Math.floor(Math.random() * (max.length));
  }

  return Math.floor(Math.random() * (max + 1)) + min;
};

// data generation function. Returns an array of 10000 randomized records
const generateListing = () => {
  const listingRecords = [];

  for (let i = 0; i < 10000; i += 1) {
    const urlId = ((listingCycle * 10000) + i).toString().padStart(8, '0');
    let listing = {
      url: `http://mtolympus.com/listings/${urlId}`,
      occ: allOccup[randomInt(allOccup)],
      type: allTypes[randomInt(allTypes)],
      beds: randomInt(9, 1),
      price: randomInt(10000, 90),
      time: allTimes[randomInt(allTimes)],
      rtg: faker.finance.amount(3, 5, 2),
      reviews: randomInt(1000),
      descr: faker.hacker.phrase(),
      zip: faker.address.zipCode(),
    };

    listingRecords.push(listing);
  };

  return listingRecords;
};

const generateImages = () => {
  const imageRecords = [];

  for (var i = 0; i < 10000; i += 1) {
    for (var j = 0; j < randomInt(10, 5); j += 1) {
      let image = {
        url: randomImage(),
        descr: faker.hacker.phrase(),
        list: i
      };

      imageRecords.push(image);
    }
  };

  return imageRecords;
};

// counter for data generation loops
let listingCycle = 0;
let imageCycle = 0;

const genManyListings = () => {
  if (listingCycle < 1000) {
    listingCycle += 1;

    let listingData = generateListing();

    listingsWriter.writeRecords(listingData)
      .then(() => {
        bar1.increment();
        genManyListings();
      })
      .catch((error) => console.log('error'));
  } else {
    bar1.stop();
    console.timeEnd('Time taken to write 10M listing records: ');
    console.log('Listing records written');
  }
};

const genManyImages = () => {
  if (imageCycle < 1000) {
    imageCycle += 1;

    let imageData = generateImages();

    imagesWriter.writeRecords(imageData)
      .then(() => {
        bar2.increment();
        genManyImages();
      })
      .catch((error) => console.log('error'));
  } else {
    bar2.stop();
    console.timeEnd('Time taken to write 50-100M image records: ');
    console.log('Image records written');
  }
};

// initialize progress bar for data generation tracking
const bar1 = multibar.create(1000, 0);
const bar2 = multibar.create(1000, 0)
console.time('Time taken to write 10M listing records: ');
genManyListings();

console.time('Time taken to write 50-100M image records: ');
genManyImages();
