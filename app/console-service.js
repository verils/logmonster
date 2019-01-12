const Client = require('ssh2').Client;
const uuid = require('uuid/v1');

const connectionTimeout = 5000;

const jobs = {};

function open(config) {
  let id = uuid().replace(/-/g, '');
  let logBuffer = [];
  let conn = connect(config, logBuffer);
  let job = { id, logBuffer, connection: conn };
  jobs[id] = job;
  setTerminateTimer(job);
  return id;
}

function trace(id, offset) {
  let job = jobs[id];
  if (job) {
    let log = job.logBuffer.join('').substring(offset);
    setTerminateTimer(job);
    return log;
  }
  return null;
}

function connect(config, logBuffer) {
  let { host, user, pass, path } = config;
  let conn = new Client();
  conn.on('ready', () => {
    conn.exec('tail -f ' + path, (err, stream) => {
      if (err) {
        console.error(err);
        conn.end();
      }
      stream.on('data', (data) => logBuffer.push(data.toString()))
      .stderr.on('data', (data) => logBuffer.push(data.toString()))
      .on('close', () => conn.end());
    });
  }).on('error', (err) => {
    console.error(err);
    logBuffer.push('Auth failed.');
    conn.end();
  });
  conn.connect({ host: host, username: user, password: pass });
  return conn;
}

function setTerminateTimer(job) {
  if (job.timer) {
    clearTimeout(job.timer);
  }
  job.timer = setTimeout(function() {
    job.connection.end();
    jobs[job.id] = null;
  }, connectionTimeout);
}

module.exports = { open, trace };
