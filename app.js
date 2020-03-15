const express = require('express');
const path = require('path');

const indexRouter = require('./app/index-route');
const consoleRouter = require('./app/console-route');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
});

app.use(indexRouter);
app.use(consoleRouter);

module.exports = app;
