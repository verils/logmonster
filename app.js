const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const route = require('./app/route');

const app = express();
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(route);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
})
module.exports = app;
