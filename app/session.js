"use strict";

// == Imports ===============================================================

var session = require('express-session');
var connectRedis = require('connect-redis');
var uuid = require('node-uuid');

var config = require('../lib/config');

// == Extension Hook ========================================================

module.exports = function(app) {
  var RedisStore = connectRedis(session);

  // FIX: Use config.redis

  var sessionOptions = {
    store: new RedisStore(config.redis),
    genid: function(req) {
      return uuid.v4();
    },
    cookie: { },
    resave: false,
    saveUninitialized: true,
    secret: config.site.secret
  };

  if (config.site.secure) {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }

  app.use(session(sessionOptions));
}
