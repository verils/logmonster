const fs = require('fs');
const yaml = require('js-yaml');

let doc = {};

try {
  doc = yaml.load(fs.readFileSync('./template.yml'));
} catch (e) {
  console.log(e);
  throw e
}

module.exports = doc;
