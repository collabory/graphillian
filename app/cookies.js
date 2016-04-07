"use strict";

// == Imports ===============================================================

var cookieParser = require('cookie-parser');

var config = require('../lib/config');

// == Extension Hook ========================================================

module.exports = function(app) {
  app.use(cookieParser(config.site.secret));
}
