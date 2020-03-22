const express = require('express');

module.exports = function (config) {

  const router = express.Router();

  router.route('/')
    .get(function (req, res, next) {
      const arr = [];
      const hosts = config.hosts;
      const targets = config.targets;
      Object.keys(targets).forEach(name => {
        arr.push({
          name: name,
          description: targets[name].description,
          host: targets[name].host,
          file: targets[name].file,
          docker: targets[name].docker
        })
      });
      res.json(arr);
    });

  return router;
};
