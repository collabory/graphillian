// == Import ================================================================

var app = require('../../app');
var config = require('../config');
var debug = require('debug')('testapp:server');
var http = require('http');
var port = config.site.http_port;

// == Local Variables =======================================================

var server = http.createServer(app);

// == Error Handling ========================================================

function onError(error) {
  switch (error.syscall)
  {
    case 'listen':
      switch (error.code) {
        case 'EACCES':
          console.error('Port ' + port + ' requires elevated privileges');
          process.exit(-1);
          break;
        case 'EADDRINUSE':
          console.error('Port ' + port + ' is already in use');
          process.exit(-2);
          break;
        default:
          throw error;
      }
      break;
    default:
      throw error;
  }
}

function onListening() {
  debug('Listening on port ' + server.address().port);
}

// == Exports ===============================================================

app.set('port', port);

var container = {
  port: port,
  app: app,
  http: http,
  server: server
};

// == Server Configuration ==================================================

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// == Exports ===============================================================

module.exports = container;
