const path = require('path');
const express = require('express');
const router = express.Router();

const root = path.join(__dirname, '../public');

router.get('/', function (req, res) {
  res.sendFile('index.html', {root})
});

router.get('/targets/:target/console', function (req, res) {
  res.sendFile('console.html', {root})
});

module.exports = router;
