var express = require('express');
var expressWinston = require('express-winston');
var nunjucks = require('nunjucks');
var requireDir = require('require-dir');
var util = require('util');

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
  var server = app.listen(port);
  shared.logger.info("toothub server started on " + port);

  return {
    app: app,
    server: server
  };
}
