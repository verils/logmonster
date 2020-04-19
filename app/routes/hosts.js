const express = require('express');

module.exports = function (config) {

  const router = express.Router();

  router.route('/')
    .get(function (req, res, _) {
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
    })
    .post(function (req, res) {

    });

  return router;
};
