const express = require('express');
const router = express.Router();

const resource = require('./resource');

router.get('/targets', function (req, res) {
  res.send(resource.targets)
});

module.exports = router;
