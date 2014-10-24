var util = require('util');
var _ = require('lodash');
var async = require('async');
var request = require('request');

module.exports = function (models, baseClass) {

  var Resource = baseClass();

  Resource.collection = 'resources';

  Resource.defaults = {
    url: '',
    disabled: false,
    statusCode: '',
    headers: {},
    lastError: '',
    encoding: 'utf8',
    maxAge: 3600000,
    timeout: 10000,
    lastDuration: 0,
    lastValidated: 0
  };

  Resource.id = function (obj) { return models.md5(obj.url); };

  Resource.upsertQueue = function (db) {
    return async.queue(function (task, next) {
      db.collection(Resource.collection, function (err, coll) {
        var doc = new Resource(task);
        var opts = {upsert: true, fullResult: true, w: 1};
        coll.update({_id: doc._id}, doc, opts, function (err, result) {
          next(err, doc)
        });
      });
    });
  };

  Resource.pollAll = function (db, options, each, done) {
    options = _.defaults(options || {}, {
      concurrency: 16
    });

    var collection = db.collection(Resource.collection);

    var fetchQueue = async.queue(function (task, next) {
      collection.findOne(task, function (err, doc) {
        pollQueue.push(new Resource(doc), each);
        next();
      });
    }, options.concurrency);

    var pollQueue = async.queue(function (resource, next) {
      resource.poll(db, options, function (err, r) {
        fetchQueue.resume();
        next(err, r);
      });
    }, options.concurrency);

    pollQueue.saturated = function () {
      fetchQueue.pause();
    };

    pollQueue.drain = function () {
      if (fetchQueue.length() === 0) {
        return done();
      }
    };

    var cursor = collection.find({}, {fields: {_id:1}});
    cursor.toArray(function (err, tasks) {
      fetchQueue.push(tasks);
    });

    return {fetch: fetchQueue, poll: pollQueue};
  };

  Resource.prototype.poll = function (db, options, next) {
    var $this = this;

    options = _.defaults(options || { }, {
      request: request
    });

    var t_now = Date.now();

    // Common exit point
    var _next = _.once(function (err, r) {
      setImmediate(function () {
        next(err, $this);
      });
      return $this;
    });

    // Bail out if this resource is disabled.
    if ($this.disabled) { return _next(); }

    // Skip poll if stored content is newer than max_age.
    var age = t_now - $this.lastValidated;
    var max_age = ('max_age' in options) ? options.max_age : $this.maxAge;
    if (age < max_age) { return _next(); }

    // Save resource exit point
    var _save = function (err) {
      return $this;
    };

    // Request options
    var r_opts = {
      method: 'GET',
      url: $this.url,
      timeout: options.timeout || $this.timeout,
      encoding: null,
      jar: false,
      gzip: true,
      // TODO: Track 3xx redirects, update resource URL on 301
      // followRedirect: false
    };

    // Conditional GET support...
    var prev_headers = $this.headers;
    if (prev_headers.etag) {
      r_opts.headers['If-None-Match'] = prev_headers.etag;
    }
    if (prev_headers['last-modified']) {
      r_opts.headers['If-Modified-Since'] = prev_headers['last-modified'];
    }

    var req = options.request(r_opts, function (err, resp, body) {
      $this.lastValidated = t_now;
      $this.lastDuration = Date.now() - t_now;
      if (err) {
        if ('ETIMEDOUT' == err.code || 'ESOCKETTIMEDOUT' == err.code) {
          $this.statusCode = 408;
          $this.lastError = err.code;
        } else {
          $this.statusCode = 499;
          $this.lastError = ''+err;
        }
      } else {
        $this.statusCode = resp.statusCode;
        $this.headers = resp.headers;
        if (body) {
          $this.body = body.toString($this.encoding);
        }
      }
      $this.save(db, function (err, result) {
        _next(err, $this);
      });
    });

    return $this;
  };

  return Resource;
};
