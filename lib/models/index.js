var crypto = require('crypto');
var util = require('util');
var events = require('events');
var _ = require('lodash');
var async = require('async');
var requireDir = require('require-dir');

var models = module.exports = {};

models.md5 = function md5 (/*...*/) {
  var hash = crypto.createHash('md5');
  for (var i=0; i<arguments.length; i++) {
    hash.update('' + arguments[i]);
  }
  return hash.digest('hex');
}

// In-memory "database" that pretends to be async for future expansion
models.store = {};

var baseClass = function () {

  var cls = function () {
    this.init.apply(this, arguments);
  };

  cls.defaults = {};

  cls.get = function (id, next) {
    var coll = models.store[cls.collection];
    var result = (coll && coll[id]) ? new cls(coll[id]) : null;
    next(null, result);
    return this;
  };

  cls.keys = function (next) {
    var coll = models.store[cls.collection];
    var result = (coll) ? _.keys(coll) : [];
    next(null, result);
    return this;
  };

  cls.each = function (itemCb, endCb) {
    var cls = this;
    cls.keys(function (err, keys) {
      if (!keys) { return endCb(); }
      async.eachLimit(keys, 10, function (key, next) {
        cls.get(key, function (err, item) {
          itemCb(err, item, next);
        });
      }, endCb);
    });
  };

  _.extend(cls.prototype, cls.__super__ = {

    init: function (attrs) {
      _.defaults(this, attrs || {}, cls.defaults);
      if (!this._id) {
        this._id = cls.id(this);
      }
    },

    getClass: function () { return cls; },

    toJSON: function () {
      var out = {};
      for (var k in cls.defaults) {
        out[k] = this[k];
      }
      return out;
    },

    save: function baseSave (next) {
      this.updated = Date.now();
      if (!models.store[cls.collection]) {
        models.store[cls.collection] = {};
      }
      models.store[cls.collection][this._id] = this.toJSON();
      next(null, this);
      return this;
    }

  });

  return cls;
};

var mods = requireDir();
for (name in mods) {
  models[name] = mods[name](models, baseClass);
}
