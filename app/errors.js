// == Support Functions =====================================================

function errorDiagnostic(err, req, res, next) {
  console.error(err);
  console.error(err.stack);

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status,
    error: err
  });
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.render('errors/general', {
    message: err.message,
    status: err.status,
    error: { }
  });
}

// == Exports ===============================================================

// REFACTOR: app.extend(...).before('cookies').after('router');

// { use: ..., before: ..., after: ... }

module.exports = function(app) {
  switch (app.get('env')) {
    case 'development':
      // REFACTOR: Move to environment/development.js
      app.use(errorDiagnostic);
  }

  app.use(errorHandler);
}
