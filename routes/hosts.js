const express = require('express');

module.exports = function (config) {

  const router = express.Router();

  router.route('/')
    .get(function (req, res, next) {
      const arr = [];
      const hosts = config.hosts;
      Object.keys(hosts).forEach(name => {
        arr.push({
          name: name,
          description: hosts[name].description,
          host: hosts[name].host
        })
      });
      res.json(arr);
    });

  return router;
};
