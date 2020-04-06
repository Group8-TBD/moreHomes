const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker');
const path = require('path');
const cliProgress = require('cli-progress');

const listingsWriter = createCsvWriter({
  path: path.join(__dirname, 'generated_data', 'postgresListings.csv'),
  header: [
    { id: 'urlId', title: 'URL_ID' },
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
  path: path.join(__dirname, 'generated_data', 'postgresImages.csv'),
  header: [
    { id: 'urlId', title: 'URL_ID' },
    { id: 'descr', title: 'DESCRIPTION' },
    { id: 'list', title: 'LISTING' },
  ]
});

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const randomImage = () => {

  const x = 6; //this is the number of images per home object that will be seeded (random)
  let padToThree = number => number <= 999 ? `00${number}`.slice(-3) : number; //fancy es6 zero padding function

  const imageRandom = Math.floor(Math.random() * 188); //this integer is the number of items in an AWS bucket

  return padToThree(imageRandom);
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
const generateData = () => {
  const data = {
    listings: [],
    images: []
  };

  for (let i = 0; i < 10000; i += 1) {
    let listing = {
      urlId: faker.random.uuid(),
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

    data.listings.push(listing);

    for (let j = 0; j < randomInt(10, 5); j += 1) {
      let image = {
        urlId: randomImage(),
        descr: faker.hacker.phrase(),
        list: ((cycle - 1) * 10000) + i + 1
      }

      data.images.push(image);
    }

  };

  return data;
};

// counter for data generation loops
let cycle = 0;

const generateManyRecords = () => {
  if (cycle < 1000) {
    cycle += 1;

    let data = generateData();

    listingsWriter.writeRecords(data.listings)
      .then(() => {
        imagesWriter.writeRecords(data.images)
      })
      .then(() => {
        bar1.increment();
        generateManyRecords();
      })
      .catch((error) => console.log('error'));
  } else {
    bar1.stop();
    console.timeEnd('Time taken to generate PostgreSQL data: ');
    console.log('Postgress data written. Go wild!');
  }
};

bar1.start(1000, 0);
console.time('Time taken to generate PostgreSQL data: ');
generateManyRecords();
