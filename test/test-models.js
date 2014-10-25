var testUtils = require('../lib/test-utils');
var util = require('util');
var _ = require('lodash');
var async = require('async');
var expect = require('chai').expect;
var models = require(__dirname + '/../lib/models');

var feeds_json = require(__dirname + '/fixtures/feeds.json');

beforeEach(testUtils.sharedBefore);
afterEach(testUtils.sharedAfter);

describe('models', function () {

  describe('Feed', function () {

    it('should yield expected toots after polling fixture feeds', function (done) {
      async.each(feeds_json.urls, function (data, next) {
        (new models.Feed(data)).save(next);
      }, function (err) {
        models.Feed.pollAll({}, function (err, feed) {
          expect(feed).to.not.be.null;
        }, function (err) {
          var result = JSON.parse(JSON.stringify(models.store.toots));
          expect(result).to.deep.equal(feeds_json.expected.toots);
          return done();
        });
      });
    });

  });

  describe('Toot', function () {

    it('should exist', function (done) {
      done();
    });

  });

});
