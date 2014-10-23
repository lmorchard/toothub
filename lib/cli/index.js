var util = require('util');
var requireDir = require('require-dir');
var program = require('commander');
var winston = require('winston');

var package_json = require(__dirname + '/../../package.json');
var app_json = require(__dirname + '/../../app.json');
var config = loadConfig();

program.version(package_json.version)
  .option('-D, --debug', 'enable debugging and debug output')
  .option('-q, --quiet', 'quiet output, except for errors')
  .option('-v, --verbose', 'enable verbose output');

module.exports = function () {
  program.parse(process.argv);
};

function init (next) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var options = args[args.length - 1];

    var shared = { config: config };

    var log_level = options.parent.debug ? 'debug' :
      options.parent.verbose ? 'verbose' :
      options.parent.quiet ? 'error' : 'info';

    shared.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: log_level,
          colorize: true
        })
      ]
    });

    shared.logger.setLevels({
      silly: 0, debug: 1, verbose: 2,
      info: 3, warn: 4, error: 5
    });

    // Pretend we're doing some async init stuff for now
    setImmediate(function () {
      shared.done = function () {
        process.exit();
      };
      args.push(shared);
      next.apply(this, args);
    });

  }
}


function loadConfig () {

  // Grab defaults from the app.json env
  var defaults = app_json.env;

  // Attempt to read config.json, but no sweat if it fails
  var config;
  try {
    var config_fn = __dirname+ '/../../config.json';
    var config_in = JSON.parse(fs.readFileSync(config_fn, 'utf-8'));
    config = _.defaults(config_in, defaults);
  } catch (e) {
    config = defaults;
  };

  // Allow envvars to override defaults and config.json
  for (var i in config) {
    config[i] = process.env[i] || config[i];
  }

  return config;
}

// Load up all the command modules...
var cmds = requireDir();
for (name in cmds) {
  cmds[name](program, init);
}
