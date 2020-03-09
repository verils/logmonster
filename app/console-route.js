const fs = require('fs');
const yaml = require('js-yaml');
const express = require('express');
const router = express.Router();
const Client = require('ssh2').Client;

let doc;
try {
  doc = yaml.load(fs.readFileSync('./template.yml'));
} catch (e) {
  console.log(e)
}

router.get('/api/sse/console/:target', function (req, res) {
  let target = doc.targets[(req.params.target)];
  let host = doc.hosts[target.host];

  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  function sendLog(data) {
    res.write(`id: ${Date.now()}\n`);
    res.write('event: log\n');
    res.write(`data: ${data}\n\n`)
  }

  let cmd = `${target.sudo ? 'sudo ' : ''}tail -f ${target.file}`;

  let conn = new Client();
  let privateKey = Buffer.from(host.privateKey, 'utf-8');
  conn.on('ready', () => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(err);
        conn.end();
      }
      stream.on('data', (data) => {
        sendLog(data.toString())
      }).stderr.on('data', (data) => {
        sendLog(data.toString())
      }).on('close', () => conn.end());
    });
  }).on('error', (err) => {
    console.error(err);
    sendLog(err);
    conn.end();
  }).connect({
    host: host.host,
    username: host.username,
    privateKey: privateKey
  });
});

module.exports = router;
