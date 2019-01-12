const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const consoleRouter = require('./app/console-router');
const consoleApiRouter = require('./app/console-api-router');

const app = express();
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(consoleRouter);
app.use('/api/console', consoleApiRouter);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
})
module.exports = app;
