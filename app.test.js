const request = require('supertest');
const app = require('./app.js');

describe('GET /', function () {
  it('response with index page', function (done) {
    request(app)
    .get('/')
    .expect(200, done);
  });
});
