var util = require('util');
var fs = require('fs');
var nunjucks = require('nunjucks');
var stylus = require('stylus');
var browserify = require('browserify-middleware');
var requireDir = require('require-dir');
var _ = require('lodash');

var express = require('express');
var app = express();

// Set up nunjucks environment
var njEnv = nunjucks.configure('views', {autoescape: true, watch: true});
njEnv.express(app);
njEnv.addFilter('json', function (obj) {
  return JSON.stringify(obj, null, '  ');
});

// Load, mount, and configure all the sub-app modules.
var appModules = requireDir();
for (name in appModules) {
  var subapp = appModules[name];
  njEnv.express(subapp);
  app.use('/', subapp);
}

// Mount CSS (via stylus), JS (via browserify), and HTML (via static)
var htdocsPath = __dirname + '/../../htdocs';
var cssPath = htdocsPath + '/css';
app.use(stylus.middleware({ src: cssPath, dest: cssPath }));
app.use('/js', browserify(__dirname + '../../client'));
app.use(express.static(htdocsPath));

module.exports = app;
