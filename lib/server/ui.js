var util = require('util');
var _ = require('lodash');
var async = require('async');
var express = require('express');
var models = require(__dirname + '/../models');

module.exports = function (app, shared) {

  app.get('/', function (req, res) {
    var out = {
      toots: []
    };
    models.Toot.each(function (err, toot, next) {
      models.Feed.get(toot.feedId, function (err, feed) {
        toot.feed = feed;
        out.toots.push(toot);
        next();
      });
    }, function (err) {
      out.toots = _.sortBy(out.toots, 'published').reverse();
      res.render('index.html', out);
    });
  });

};
