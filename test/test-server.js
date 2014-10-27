var util = require('util');
var _ = require('lodash');
var async = require('async');
var expect = require('chai').expect;
var request = require('request');
var hippie = require('hippie');
var PubSub = require('pubsub-js');

var toothub = require(__dirname + '/..');
var models = require(__dirname + '/../lib/models');

var testUtils = require('../lib/test-utils');
var feeds_json = require(__dirname + '/fixtures/feeds.json');

describe('server', function () {

  describe('ui', function () {

    it('should be working', function (done) {
      request({
        method: 'GET',
        url: 'http://127.0.0.1:6060/'
      }, function (err, resp, body) {
        done();
      });
    });

  });

  describe('api', function () {

    it('should handle a feed ping', function (done) {
      var url = 'http://127.0.0.1:5050/tooter4/index.html';
      var id = models.Feed.id({ url: url });

      var ctBefore = 0;
      models.Toot.each(function (err, toot, next) {
        if (toot.feedId == id) { ctBefore++; }
        next();
      }, function (err) {

        expect(ctBefore).to.equal(0);

        hippie().post('http://127.0.0.1:6060/api/ping')
          .form().send({ url: url })
          .expectStatus(204)
          .end(function(err, res, body) {
            if (err) throw err;
          });

        PubSub.subscribe('ping', function (msg, feed) {
          expect(feed._id).to.not.be.null;
          expect(feed.url).to.equal(url);
          expect(feed.statusCode).to.equal(200);

          var ctAfter = 0;
          models.Toot.each(function (err, toot, next) {
            if (toot.feedId == id) { ctAfter++; }
            next();
          }, function (err) {
            expect(ctAfter).to.equal(3);
            return done();
          });

        });

      });

    });

  });

});

var appServer;

before(function (done) {
  toothub.initShared({
    PORT: 6060,
    verbose: true
  }, function (err, shared) {
    async.each(feeds_json.urls, function (data, next) {
      (new models.Feed(data)).save(next);
    }, function (err) {
      models.Feed.pollAll({}, function (err, feed) {
        // no-op
      }, function (err) {
        appServer = require(__dirname + '/../lib/server')(shared);
        appServer.server.on('listening', done);
      });
    });
  });
});

after(function (done) {
  appServer.server.close();
  return done();
});
