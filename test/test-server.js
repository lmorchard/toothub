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

var appServer;

before(function (done) {
  done();
});

after(function (done) {
  done();
});

beforeEach(function (done) {
  var toots = [];
  models.Toot.each(function (err, toot, next) {
    toots.push(toot);
    next();
  }, function (err) {
    async.each(toots, function (toot, next) {
      toot.destroy(next);
    }, done);
  });
});

describe('server', function () {

  describe('ui', function () {

  });

  describe('api', function () {

    it('should handle a feed ping', function (done) {
      var url = 'http://127.0.0.1:5050/fixtures/tooter1.html';
      var id = models.Feed.id({ url: url });

      hippie().post('http://127.0.0.1:5050/api/ping')
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
          expect(ctAfter).to.equal(1);
          return done();
        });

      });

    });

  });

});
