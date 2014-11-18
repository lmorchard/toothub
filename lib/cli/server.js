var util = require('util');
var fs = require('fs');
var express = require('express');
var expressWinston = require('express-winston');

module.exports = function (program, init) {
  program
    .command('server')
    .description('start HTTP app server')
    .action(init(cmd));
};

function cmd (options, shared) {
  var app = express();

  for (var k in shared.config) {
    app.set(k, shared.config[k]);
  }

  app.use(expressWinston.logger({
    winstonInstance: shared.logger,
    level: 'verbose'
  }));

  var serverApp = require(__dirname + '/../server');
  app.use('/', serverApp);

  var port = shared.config.PORT || 4040;
  var server;

  if (shared.config.SSL_ENABLED && shared.config.SSL_KEY && shared.config.SSL_CERT) {

    var https = require('https');
    var options = {
      key: fs.readFileSync(shared.config.SSL_KEY),
      cert: fs.readFileSync(shared.config.SSL_CERT)
    };
    server = https.createServer(options, app);
    server.listen(port, function (err) {
      console.log('HTTPS server listening on port ' + port);
    });

  } else {

    var http = require('http');
    server = http.createServer(app)
    server.listen(port, function (err) {
      console.log('HTTP server listening on port ' + port);
    });

  }
}
