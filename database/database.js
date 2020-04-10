const pg = require('pg');

const pool = new pg.Pool({
  user: 'vincenthuang',
  host: 'localhost',
  database: 'tbdb_homes'
});

pool.on('error', (err, client) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.connect((err) => {
  if (err) {
    console.log('Error connecting to pool', err);
  } else {
    console.log('Successful connection to pool');
  }
});

module.exports = pool;
