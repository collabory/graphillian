// == Imports ===============================================================

var through2 = require('through2');
var fs = require('fs');

// Based off https://github.com/derhuerst/gulp-skip-conflicts by derhuerst

// == Exported Functions ====================================================

function ifnotexist() {
  return through2.obj(function(file, encoding, cb) {
    fs.exists(file.path, function(exists) {
      if (exists) {
        return cb();
      }

      return cb(null, file);
    });
  });
}

// == Exports ===============================================================

module.exports = ifnotexist;
