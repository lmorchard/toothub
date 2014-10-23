var fs = require('fs');
var util = require('util');
var _ = require('lodash');
var async = require('async');

module.exports = function (program, init) {
  program
    .command('hello')
    .description('hello there')
    .action(init(cmd));
};

function cmd (options, shared) {
  shared.logger.debug("HELLO?");
  return shared.done();
}
