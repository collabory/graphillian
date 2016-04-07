// == Imports ===============================================================

var fs = require('fs');
var merge = require('merge');
var path = require('path');

// == Local Variables =======================================================

var env = process.env.NODE_ENV || 'development';

// == Constants =============================================================

var hostnameDefault = {
  development: 'graphillian.dev'
}

// == Support Functions =====================================================

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // Passenger: UNIX Socket
    return val;
  }

  if (port >= 0) {
    // Port number
    return port;
  }

  return false;
}

function hostname() {
  var hostnamePath = path.resolve(__dirname, '../config/hostname');

  if (fs.existsSync(hostnamePath)) {
    return fs.readFileSync(hostnamePath).toString().replace(/[\r\n]+/, '');
  }

  return hostnameDefault[env];
}

// == Exports ===============================================================

module.exports = {
  env: env,
  hostname: hostname(),
  site: require('../config/site.json')
};
