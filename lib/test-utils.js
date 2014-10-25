process.env.NODE_ENV = 'test';

var util = require('util');
var express = require('express');

var TEST_PORT = 5050;
var TEST_BASE_URL = 'http://127.0.0.1:' + TEST_PORT;

var testApp, testServer;

exports.u = function (path) {
  return TEST_BASE_URL + '/' + path;
}

exports.sharedBefore = function (done) {
  // Start up an HTTP server for fixtures.
  testApp = express();
  testApp.use(express.static(__dirname + '/../test/fixtures/htdocs'));
  testServer = testApp.listen(TEST_PORT);
  util.debug('server up');
  done();
};

exports.sharedAfter = function (done) {
  // Make sure to clean up the fixtures server.
  testServer.close();
  util.debug('server down');
  done();
};
