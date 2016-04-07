"use strict";

var config = require('../lib/config');

// == Application Extension ==================================================

module.exports = function(app) {
  app.use('/', require('./home'));
};
