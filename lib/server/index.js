var express = require('express');
var expressWinston = require('express-winston');
var requireDir = require('require-dir');

module.exports = function (shared) {
  var app = express();

  app.use(expressWinston.logger({
    winstonInstance: shared.logger,
    level: 'verbose'
  }));

  var appModules = requireDir();
  for (name in appModules) {
    appModules[name](app, shared);
  }

  var port = shared.config.PORT || 4040;
  app.listen(port);
  shared.logger.info("toothub server started on " + port);
}
