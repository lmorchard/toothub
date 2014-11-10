var _ = require('lodash');
var fs = require('fs');
var util = require('util');

var toothub = module.exports;
var winston = require('winston');

var app_json = require(__dirname + '/../app.json');

toothub.initShared = function (options, next) {
  var config = toothub.loadConfig(options);
  var shared = { config: config };

  config.log_level = options.debug ? 'debug' :
    options.verbose ? 'verbose' :
    options.quiet ? 'error' :
    config.log_level;

  shared.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: config.log_level,
        colorize: true
      })
    ]
  });

  shared.logger.setLevels({
    silly: 0, debug: 1, verbose: 2,
    info: 3, warn: 4, error: 5
  });

  shared.done = function () {
    process.exit();
  };

  next(null, shared);
};

toothub.loadConfig = function (options) {
  var defaults = {
    "PORT": 3000,
    "SSL_ENABLED": false,
    "SSL_KEY": "key.pem",
    "SSL_CERT": "cert.pem",
    "DEBUG": false,
    "LOG_LEVEL": 'info'
  };

  // Grab more defaults from the app.json env
  var config = _.defaults(defaults, app_json.env);

  // Attempt to read config.json, but no sweat if it fails
  try {
    var config_fn = __dirname+ '/../config.json';
    var config_in = JSON.parse(fs.readFileSync(config_fn, 'utf-8'));
    config = _.defaults(config_in, defaults);
  } catch (e) {
    config = defaults;
  };

  // Allow envvars to override defaults and config.json
  for (var i in config) {
    config[i] = process.env[i] || config[i];
  }

  return _.extend(config, options || {});
}
