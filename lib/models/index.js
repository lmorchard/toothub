var crypto = require('crypto');
var util = require('util');
var events = require('events');
var _ = require('lodash');
var requireDir = require('require-dir');

var models = module.exports = {};

models.store = {};

models.md5 = function md5 (/*...*/) {
  var hash = crypto.createHash('md5');
  for (var i=0; i<arguments.length; i++) {
    hash.update('' + arguments[i]);
  }
  return hash.digest('hex');
}

var baseClass = function () {

  var cls = function () {
    this.init.apply(this, arguments);
  };

  cls.defaults = {};

  cls.get = function (id, next) {
    var cls = this;
    if (!models.store[cls.collection]) { return next(); }
    var data = models.store[cls.collection][id];
    if (!data) { return next(); }
    next(null, new cls(data));
    return this;
  };

  cls.each = function (itemCb, endCb) {
    var cls = this;
    for (var id in models.store[cls.collection]) {
      var data = models.store[cls.collection][id];
      itemCb(null, new cls(data), id);
    }
    endCb(null);
  };

  cls.__base__ = {

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
      next();
      return this;
    }

  };

  _.extend(cls.prototype, cls.__base__);

  return cls;
};

var mods = requireDir();
for (name in mods) {
  models[name] = mods[name](models, baseClass);
}
