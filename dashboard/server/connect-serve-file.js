'use strict';

module.exports = function connectServeFile(file, mimeType) {
  var fullPath = require('path').join(__dirname, file);
  var fs = require('fs');
  return function serveFile(req, res) {
    fs.stat(fullPath, function(err, stats) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type':   mimeType || 'application/javascript',
          'Content-Length': stats.size
        });

        fs.createReadStream(fullPath).pipe(res);
      }
    });
  };
};
