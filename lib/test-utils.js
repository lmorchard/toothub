process.env.NODE_ENV = 'test';

var util = require('util');
var express = require('express');
var toothub = require(__dirname + '/..');

exports.TEST_PORT = 5050;
exports.TEST_BASE_URL = 'http://127.0.0.1:' + exports.TEST_PORT;

testApp = express();
testApp.use(express.static(__dirname + '/../test/fixtures/htdocs'));
testServer = testApp.listen(exports.TEST_PORT);
