const express = require('express');
const Client = require('ssh2').Client;

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

  router.route('/:target/console')
    .get(function (req, res) {
      res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      });

      let eventId = 1;

      function sendMessage(event, data) {
        res.write(`id: ${eventId++}\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${data}\n\n`)
      }

      const targetName = req.params.target;
      const target = config.targets[(targetName)];
      if (!target) {
        sendMessage('error', `target not found: '${targetName}'`);
        return
      }

      const hostname = target.host;
      const host = config.hosts[hostname];
      if (!host) {
        sendMessage('error', `host not found: '${hostname}'`);
        return
      }

      const tail = req.query.tail;

      let cmd;
      if (target.docker) {
        let tailOption = tail ? `--tail ${tail}` : '';
        cmd = `docker logs -f ${tailOption} ${target.docker} 2>&1`
      } else if (target.file) {
        let sudoOption = target.sudo ? 'sudo ' : '';
        let tailOption = tail ? `-n ${tail}` : '';
        cmd = `${sudoOption} tail -f ${tailOption} ${target.file}`
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

      let interval = 0;
      const conn = new Client();
      conn.on('ready', () => {
        conn.exec(cmd, (err, stream) => {
          if (err) {
            console.error('command execute failed: ', err);
            conn.end();
          }

          const buffer = [];
          let missDataCount = 0;

          function startFlushing() {
            console.log('start flushing buffer');
            return setInterval(() => {
              console.log('send message, buffer size: ', buffer.length);
              while (buffer.length) {
                let text = buffer.shift();
                sendMessage('log', text);
              }
              missDataCount++;
              if (missDataCount >= 3) {
                // pause sending message until data income
                clearInterval(interval);
                interval = 0;
              }
            }, 150);
          }

          function onData(data) {
            console.log('data income');
            let text = data.toString();
            let lines = text.split('\n');
            lines.pop();
            buffer.push(...lines);
            missDataCount = 0;
            if (interval === 0) {
              interval = startFlushing();
            }
          }

          // flush buffer by interval
          interval = startFlushing();

          stream.on('data', onData).stderr.on('data', onData)
            .on('close', () => conn.end());
        });
      }).on('error', (err) => {
        console.error('connection error: ', err);
        sendMessage('error', err);
        conn.end();
      }).on('close', () => {
        console.log('connection closed');
        clearInterval(interval);
      }).connect(options);
    });

  return router;
};
