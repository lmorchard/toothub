var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var PubSub = require('pubsub-js');

var models = require(__dirname + '/../models');

module.exports = function (app, shared) {

  var pingQueue = async.queue(function (task, next) {
    var attrs = { url: task.url };
    var id = models.Feed.id(attrs);
    models.Feed.get(id, function (err, feed) {
      if (!feed) {
        // TODO: Option to abort ping if feed wasn't pre-registered
        feed = new models.Feed(attrs);
      }
      feed.poll({}, function (err, result) {
        PubSub.publish('ping', feed);
        return next();
      });
    });
  }, shared.config.pingConcurrency || 16);

  app.post('/api/ping', bodyParser.urlencoded(), function (req, res) {
    pingQueue.push({ url: req.body.url });
    res.status(204).send();
  });

  app.post('/api/register', function (req, res) {
  });

};
