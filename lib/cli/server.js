module.exports = function (program, init) {
  program
    .command('server')
    .description('start HTTP app server')
    .action(init(cmd));
};

function cmd (options, shared) {
  require(__dirname + '/../app')(shared);
}
