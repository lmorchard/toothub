var util = require('util');
var _ = require('lodash');
var async = require('async');
var expect = require('chai').expect;
var models = require(__dirname + '/../lib/models');

var testUtils = require('../lib/test-utils');

describe('models', function () {

  describe('Feed', function () {

    it('should yield the entry after polling HTML feed', function (done) {
      var url = 'http://127.0.0.1:5050/fixtures/tooter1.html';
      var data = { url: url };
      var feedId = models.Feed.id(data);

      new models.Feed(data).save(function (err, feed) {
        models.Feed.pollAll({}, function (err, feed) {
          expect(feed).to.not.be.null;
        }, function (err) {
          models.Toot.each(function (err, toot, next) {

            if (toot.feedId !== feedId) {
              return next();
            }

            expect(toot.url)
              .to.equal('http://example.com/index.html#8673509');
            expect(toot.content)
              .to.equal('This is example content');
            expect(toot.published.getTime())
              .to.equal(new Date('2014-11-28T02:12:00Z').getTime());
            expect(toot.author).to.deep.equal({
              url: 'http://example.com/author',
              photo: 'http://example.com/author.png',
              name: 'Example Author',
              nickname: 'exauthor'
            });

            return next();

          }, done);
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
