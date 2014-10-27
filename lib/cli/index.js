var requireDir = require('require-dir');
var program = require('commander');
var toothub = require(__dirname + '/..');

var package_json = require(__dirname + '/../../package.json');
program.version(package_json.version)
  .option('-D, --debug', 'enable debugging and debug output')
  .option('-q, --quiet', 'quiet output, except for errors')
  .option('-v, --verbose', 'enable verbose output');

function init (next) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var options = args[args.length - 1];

    toothub.initShared(options.parent, function (err, shared) {
      args.push(shared);
      next.apply(this, args);
    });
  }
}

// Load up all the command modules...
var cmds = requireDir();
for (name in cmds) {
  cmds[name](program, init);
}

module.exports = function () {
  program.parse(process.argv);
};
