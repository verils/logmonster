const path = require('path');
const express = require('express');
const router = express.Router();
const Client = require('ssh2').Client;
const resource = require('./resource');

router.get('/console/:target', function (req, res) {
  res.sendFile('console.html', {
    root: path.join(__dirname, '../public')
  })
});

router.get('/api/sse/console/:target', function (req, res) {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  let eventId = 1;

  function sendMessage(event, text) {
    let lines = text.split('\n');
    lines.pop();

    let data = JSON.stringify(lines);

    res.write(`id: ${eventId++}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${data}\n\n`)
  }

  let targetName = req.params.target;
  let target = resource.targets[(targetName)];
  if (!target) {
    sendMessage('error', `target not found: '${targetName}'`);
    return
  }

  let hostname = target.host;
  let host = resource.hosts[hostname];
  if (!host) {
    sendMessage('error', `host not found: '${hostname}'`);
    return
  }

  let cmd;
  if (target.docker) {
    cmd = `docker logs -f ${target.docker}`
  } else if (target.file) {
    cmd = `${target.sudo ? 'sudo ' : ''}tail -f ${target.file}`
  } else {
    sendMessage('error', `target invalid`);
    return;
  }

  let options;
  if (host.privateKey) {
    options = {
      host: host.host,
      username: host.username,
      privateKey: Buffer.from(host.privateKey, 'utf-8')
    };
  } else if (host.password) {
    options = {
      host: host.host,
      username: host.username,
      password: host.password
    };
  } else {
    sendMessage('error', `host credentials invalid`);
    return;
  }

  let conn = new Client();
  conn.on('ready', () => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error('command execute failed: ', err);
        conn.end();
      }

      function onData(data) {
        sendMessage('log', data.toString());
      }

      stream.on('data', onData).stderr.on('data', onData)
        .on('close', () => conn.end());
    });
  }).on('error', (err) => {
    console.error('connection error: ', err);
    sendMessage('error', err);
    conn.end();
  }).connect(options);
});

module.exports = router;
