# MntOlympus Home/Travel/Booking App

> Recommended listing component for home/travel/reservation application

## Related Projects

  - https://github.com/MntOlympus/reviews
  - https://github.com/MntOlympus/reservations
  - https://github.com/MntOlympus/photos

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

### Installing Dependencies

From within the root directory:

```sh
npm install
```

After installing dependencies, execute 'npm run seed' from the command line. This will provide a randomized set of homes to load in the component in your mongoDB database under the db called 'recommendations'.

After that, run 'npm start' to start the server. Point your client browser to 'localhost:3009' to access!

Enjoy.

## Requirements
MongoDB v4.2.3 installed on user's system. To verify this, simply type 'mongo' from your terminal command line and check the version.
This application assumes a no-password access to mongoDB. Further configuation would be required in the ./database/seed.js file to require password access for seeding the database.

Otherwise, refer to [Usage](#Usage)

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0

## Development
You can run the server in development mode by running:
-npm run start-dev (this uses nodemon)

...and develop the react components by simply running:
-npm run react-dev (this runs webpack and related confirguration, watching the files to update in real-time)


## API Requests
### Get the initial set of listings

```
GET /recommendations
```

#### Response
The response `records` will be a JSON object

`Status: 200 OK`
```
{"space":{"occupancy":"entire","type":"house","bedCount":89815},
"rate":{"price":15823,"timeframe":"nightly"},
"review":{"stars":56548,"reviewers":8872},
"images":["AWS(url.1)","AWS(url.2)","...etc"],
"_id":19,
"title":"The USB panel is down, reboot the auxiliary sensor so we can hack the IB card!",
"description":"HTTP",
"__v":0}
```

### Create a new listing

```
POST /addlisting
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| data | object | **Required** The data of the new database record. Should include the title, space, and rate. |

#### Example input
The `data` input should have three properties that store certain properties about the rental home.

| Name | Type | Description |
| --- | --- | --- |
|  title | string | The name of the listing |
| space  | object | Has three properties of its own:
* occupancy (`string`) tells the renter what kind of rental the property is:
  * 'entire' = entire place
  * 'private' = private room
  * 'shared' = shared room
* type (`string`) tells the renter what kind of property is being listed:
  * 'house'
  * 'apartment'
  * 'villa'
  * 'condo'
  * 'squat'
  * 'tech palace'
* bedCount (`number`) is the number of beds in the property
|
| rate | object | Has two properties of its own relating to the rental price of the property:
* price (`number`) is the rate of the rental
* timeframe (`string`) is how often the rate is applied:
  * 'nightly'
  * 'weekly'
  * 'monthly'
|

```
{
  title: "My Home",
  space: {
    occupancy: "entire",
    type: "tech palace",
    bedCount: 200000
  },
  rate: {
    price: 1000000,
    rate: "nightly"
  }
}
```