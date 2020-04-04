const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker');
const path = require('path');
const cliProgress = require('cli-progress');
const csvWriter = createCsvWriter({
  path: path.join(__dirname, 'generated_data', 'cassData.csv'),
  header: [
    { id: 'zip', title: 'ZIP'},
    { id: 'url', title: 'URL' },
    { id: 'rtg', title: 'AVG_RTG' },
    { id: 'beds', title: 'BED_COUNT' },
    { id: 'descr', title: 'DESCRIPTION' },
    { id: 'img', title: 'IMG' },
    { id: 'reviews', title: 'NUM_REVIEWS' },
    { id: 'occ', title: 'OCCUPANCY' },
    { id: 'price', title: 'PRICE' },
    { id: 'time', title: 'TIMEFRAME' },
    { id: 'type', title: 'TYPE' },
  ]
});

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

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

  return Math.floor(Math.random() * (max + 1));
};

// data generation function. Returns an array of 10000 randomized records
const generateData = () => {
  const allRecords = [];

  for (let i = 0; i < 10000; i += 1) {
    const zip = faker.address.zipCode();
    const urlId = ((cycle * 10000) + i).toString().padStart(8, '0');
    const rtg = faker.finance.amount(3, 5, 2);
    const beds = randomInt(9, 1);
    const descr = faker.hacker.phrase();
    const reviews = randomInt(1000);
    const occ = allOccup[randomInt(allOccup)];
    const price = randomInt(10000, 90);
    const time = allTimes[randomInt(allTimes)];
    const type = allTypes[randomInt(allTypes)];

    for (let j = 0; j < 5; j += 1) {
      let record = {
        zip,
        url: `http://mtolympus.com/listings/${urlId}`,
        rtg,
        beds,
        descr,
        img: randomImage(),
        reviews,
        occ,
        price,
        time,
        type,
      };

      allRecords.push(record);
    }
  };

  return allRecords;
};

// counter for data generation loop
let cycle = 0;

const generateManyRecords = () => {
  if (cycle < 1000) {
    let data = generateData();

    csvWriter.writeRecords(data)
    .then(() => {
      cycle += 1;
      bar1.increment();
      generateManyRecords();
    })
      .catch((error) => console.log('error'));
  } else {
    bar1.stop();
    console.timeEnd('Time taken to generate Cassandra data: ');
    console.log('Records written. Party!');
  }
};

// initialize progress bar for data generation tracking
bar1.start(1000, 0)
console.time('Time taken to generate Cassandra data: ');
generateManyRecords();
