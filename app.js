const express = require('express');
const bodyParser = require('body-parser');

const indexRoute = require('./app/index-route');
const consoleRoute = require('./app/console-route');

const app = express();

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(indexRoute);
app.use(consoleRoute);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
});

module.exports = app;
