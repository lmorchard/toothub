process.env.NODE_ENV = 'test';

var util = require('util');
var expect = require('chai').expect;
var express = require('express');

var TEST_PORT = 5050;
var TEST_BASE_URL = 'http://127.0.0.1:' + TEST_PORT;

var testApp, testServer;

var async = require('async');
var microformats = require('microformat-node');
var minimongo = require('minimongo');

var models = require(__dirname + '/../lib/models');

describe('play', function () {

  it('should be fun', function (done) {

    microformats.parseUrl(u('/tooter1/index.html'), {}, function (err, data) {

      //util.debug(util.inspect(data, {depth:null}));

      return done();

    });

  });

});

before(function (done) {

  // Start up an HTTP server for fixtures.
  testApp = express();
  testApp.use(express.static(__dirname + '/fixtures/htdocs'));
  testServer = testApp.listen(TEST_PORT);

  var feeds_json = require(__dirname + '/fixtures/feeds.json');

  async.each(feeds_json, function (data, next) {
    var feed = new models.Resource(data);
    feed.save(next);
  }, function (err) {
    models.Resource.each(function (err, feed, id) {
      util.debug(id + ' = ' + feed.url);
    }, function (err) {
      return done();
    });
  });

});

after(function () {
  // Make sure to clean up the fixtures server.
  testServer.close();
});

function u (path) {
  return TEST_BASE_URL + '/' + path;
}
