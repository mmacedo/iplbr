module.exports = function connectServeFile(file, mimeType) {
  return function serveFile(req, res) {
    var fs = require('fs');
    fs.stat(file, function(err, stats) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type' : mimeType || 'application/javascript',
          'Content-Length': stats.size
        });

        fs.createReadStream(file).pipe(res);
      }
    });
  };
};
