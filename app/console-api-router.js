const express = require('express');
const router = express.Router();

const logConsole = require('./console-service');

router.post('/open', function(req, res) {
  let id = logConsole.open(req.body);
  res.send({
    success: true,
    job: id
  });
});

router.get('/:id/trace', function(req, res) {
  let id = req.params.id;
  let offset = req.query.offset;
  let log = logConsole.trace(id, offset);
  res.send(log);
});

module.exports = router;
