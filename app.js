const express = require('express');
const path = require('path');

const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, _) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({message: err.message});
});

app.use(require('./routes/pages'));

app.use('/api/hosts', require('./routes/hosts')(config));
app.use('/api/targets', require('./routes/targets')(config));

module.exports = app;
