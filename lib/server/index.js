var util = require('util');
var fs = require('fs');
var express = require('express');
var expressWinston = require('express-winston');
var nunjucks = require('nunjucks');
var requireDir = require('require-dir');

module.exports = function (shared) {
  var app = express();

  app.use(expressWinston.logger({
    winstonInstance: shared.logger,
    level: 'verbose'
  }));

  var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
  });

  env.addFilter('json', function (obj) {
    return JSON.stringify(obj, null, '  ');
  });

  var appModules = requireDir();
  for (name in appModules) {
    appModules[name](app, shared);
  }

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

  return {
    app: app,
    server: server
  };
}
