// == Imports ===============================================================

var csrf = require('csurf');
var express = require('express');
var merge = require('merge');
var Promise = require('bluebird').Promise;

// var models = require('../models')
var config = require('../lib/config');

// == Support Functions =====================================================

function props(target, promises) {
  return Promise.props(promises).then(function(r) {
    merge(target, r);
  });
}

function update(model, params, fields) {
  if (!model || !params || !fields) {
    return;
  }

  // DEBUG
  console.log({ params: params, fields: fields })

  // UPGRADE: Make this handle 'x.y' type field specifications
  fields.forEach(function(field) {
    if (field in params) {
      model[field] = params[field];
    }
  });
}

function importErrors(locals, type, err) {
  if (!locals.errors) {
    locals.errors = { };
  }

  if (!locals.errors[type]) {
    locals.errors[type] = { };
  }

  var errors = locals.errors[type];

  err.errors.forEach(function(error) {
    if (!errors[error.path]) {
      errors[error.path] = [ ];
    }

    errors[error.path].push(error);
  })
}

// == Exports ===============================================================

module.exports = function(options) {
  var controller = express.Router();

  // controller.models = models;
  controller.config = config;
  
  controller.Promise = Promise;
  controller.merge = merge;
  controller.props = props;
  controller.update = update;
  controller.importErrors = importErrors;

  if (options && options.loginRequired) {
    controller.use(function(req, res, next) {
      if (req.user) {
        next();
        return;
      }

      req.session.postLoginUrl = req.originalUrl;

      req.session.save(function(err) {
        res.redirect('/login');  
      });
    })
  }

  if (options && options.csrf)
  {
    controller.use(
      csrf({ cookie: true }),
      function(req, res, next) {
        res.locals.csrfToken = req.csrfToken();
        next();
      }
    );
  }

  return controller;
}
