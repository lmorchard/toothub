process.env.NODE_ENV = 'test';

var util = require('util');
var express = require('express');

var TEST_PORT = 5050;
var TEST_BASE_URL = 'http://127.0.0.1:' + TEST_PORT;

var testApp, testServer;
testApp = express();
testApp.use(express.static(__dirname + '/../test/fixtures/htdocs'));
testServer = testApp.listen(TEST_PORT);
