var express = require('express');
var stylus = require('stylus');
var browserify = require('browserify-middleware');

var htdocsPath = __dirname + '/../../htdocs';

module.exports = function (app, shared) {

  app.use(stylus.middleware({
    src: htdocsPath + '/css',
    dest: htdocsPath + '/css',
    debug: shared.config.DEBUG,
    force: shared.config.DEBUG
  }));

  app.use('/js', browserify(__dirname + '../../client', {
  }));

  app.use(express.static(htdocsPath));

};
