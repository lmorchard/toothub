var util = require('util');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var PubSub = require('pubsub-js');
var cors = require('cors');

var models = require(__dirname + '/../models');

var express = require('express');
var app = express();

app.options('/api/ping', cors());

app.post('/api/ping', cors(), bodyParser.urlencoded({ extended: true }), function (req, res) {
  pingQueue.push({ url: req.body.url });
  res.status(204).send();
});

var pingQueue = async.queue(function (task, next) {
  var attrs = { url: task.url };
  var id = models.Feed.id(attrs);
  models.Feed.get(id, function (err, feed) {
    if (!feed) {
      // TODO: Option to abort ping if feed wasn't pre-registered
      feed = new models.Feed(attrs);
    }
    feed.poll({
      max_age: 500
    }, function (err, result) {
      PubSub.publish('ping', feed);
      return next();
    });
  });
}, app.get('PING_CONCURRENCY') || 16);

module.exports = app;
