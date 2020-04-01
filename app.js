const express = require('express');
const path = require('path');

const config = require('./app/config');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({message: err.message});
});

app.use(require('./routes'));

app.use('/api/hosts', require('./routes/api/hosts')(config));
app.use('/api/targets', require('./routes/api/targets')(config));

module.exports = app;
