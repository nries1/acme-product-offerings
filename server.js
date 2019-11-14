const express = require('express');
const path = require('path');
const chalk = require('chalk');
const db = require('./db.js');

const app = express();
const PORT = 3000;
const { connection, models } = require('./db.js');

db.seedAndSync().then(() => {
  models.Company.findAll().then(data => {
    console.log('these are my companies ', data);
  });
});
app.listen(PORT, () => {
  console.log(`app is listening at ${PORT}`);
});
