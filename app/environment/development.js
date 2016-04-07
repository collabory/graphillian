"use strict";

// == Imports ===============================================================

// == Support Methods =======================================================

function reportError(err, req, res, next) {
  console.error({
    params: req.params,
    body: req.body
  });

  next();
}

// == Application Extensions ================================================

module.exports = function(app) {
  app.use(reportError);
}
