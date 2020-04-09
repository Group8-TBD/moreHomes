const express = require('express');
const app = express();
const path = require('path');
const Controller = require('./controllers.js');

const bodyParser = require('body-parser');

const port = 3009;

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/recommendations?zip', Controller.getRecs);
app.post('/recommendations', Controller.addListing);
app.patch('/recommendations/listing/:id', Controller.updateListing);
app.delete('/recommendations/listing/:id', Controller.deleteListing);

app.listen(port, () => console.log(`matrix consolidating on port ${port}!`))