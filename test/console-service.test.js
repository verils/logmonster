const assert = require('assert');

const logConsole = require('../app/console-service');

const config = require('./console-config');

const connectionDelay = 400;

describe('Console', function() {
  describe('Open connection', function() {
    it('Should return job id string having size of 32', function() {
      let jobId = logConsole.open(config);
      assert(jobId.length === 32);
    })
  })

  describe('Trace log', function() {
    it('Should work fine', function(done) {
      let jobId = logConsole.open(config);
      setTimeout(function() {
        let log = logConsole.trace(jobId);
        assert(!!log);
        done();
      }, connectionDelay);
    })
  })

  describe('Trace log continously', function() {
    it('Should work fine', function(done) {
      let jobId = logConsole.open(config);
      let counter = 5;
      let buffer = '';
      setTimeout(function() {
        repeat(5, 100, function() {
          let log = logConsole.trace(jobId, buffer.length);
          buffer += log;
          // console.log(log.substring(0, log.length - 1));
          assert(!!log);
          logConsole.open(config);
        }).then(function() {
          done();
        });
      }, connectionDelay);
    })
  })

  describe('Job will be terminated automatically', function() {
    it('Should work fine', function(done) {
      this.timeout(8000);
      let jobId = logConsole.open(config);
      let counter = 5;
      let buffer = '';
      setTimeout(function() {
        repeat(5, 100, function() {
          let log = logConsole.trace(jobId, buffer.length);
          buffer += log;
          // console.log(log.substring(0, log.length - 1));
          assert(!!log);
          logConsole.open(config);
        }).then(function() {
          setTimeout(function() {
            let log = logConsole.trace(jobId, buffer.length);
            assert(!log);
            done();
          }, 5000);
        });
      }, connectionDelay);
    })
  })
})

function repeat(times, rate, task) {
  var after;
  task();
  times--
  var timer = setInterval(function() {
    if (times-- > 0) {
      task();
    }
    if (times === 0) {
      clearInterval(timer);
      if (after) after();
    }
  }, rate);
  return {
    then: function(callback) {
      after = callback;
    }
  }
}
