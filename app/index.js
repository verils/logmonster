const express = require('express');
const path = require('path');

const config = require('./config');

const index = express();

index.use(express.json());
index.use(express.static(path.join(__dirname, 'public')));

index.use(function (err, req, res, _) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({message: err.message});
});

index.use('/api/hosts', require('./routes/hosts')(config));
index.use('/api/targets', require('./routes/targets')(config));

module.exports = index;
