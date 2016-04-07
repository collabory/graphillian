"use strict";

// == Imports ===============================================================

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

// == Module Locals =========================================================

var rootDir = path.join(__dirname, '..');

// == Support Functions =====================================================

function errorNotFound(req, res, next) {
  // NOTE: If not logged in will always be bumped to the login page.
  res.render('errors/page_not_found');
}

// == Extension Hook ========================================================

module.exports = function(app) {
  app.set('views', path.join(rootDir, 'views'));
  app.set('view engine', 'jade');

  app.use(favicon(path.join(rootDir, 'public/favicon.ico')));

  app.use(express.static(path.join(rootDir, 'public')));

  var router = require('../routes')(app);

  // Catch-all route to capture "not found" cases
  app.use(errorNotFound);
}
