const express = require('express');
const router = express.Router();

router.get('/:group/:server/:file/console', function(req, res) {
  res.sendFile('console.html', {
    root: __dirname + '/../public'
  });
});

module.exports = router;
