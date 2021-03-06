'use strict';

function reverse(text) {
  return text.split('').reverse().join('');
}

function callReversed(text, mapFunction) {
  return reverse(mapFunction(reverse(text)));
}

module.exports = function connectInject(snippet, asEarlyAsPossible) {
  return function inject(req, res, next) {
    var filepath = require('url').parse(req.url).pathname;
    filepath = filepath.slice(-1) === '/' ? filepath + 'index.html' : filepath;

    if (require('path').extname(filepath) !== '.html') {
      return next();
    }

    var injected = false;
    var writeHead = res.writeHead;
    var write = res.write;
    var end = res.end;

    res.write = function(string, encoding) {
      if (injected === true) {
        return write.call(res, string, encoding);
      }

      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string;
        res.data = (res.data || '') + body;
      }

      return true;
    };

    res.writeHead = function() {
      if (injected === true) {
        return writeHead.apply(res, arguments);
      }

      // Delete Content-Length
      if (res.getHeader('content-length')) {
        res.removeHeader('content-length');
      }

      writeHead.apply(res, arguments);
    };

    res.end = function(string, encoding) {
      if (injected === true) {
        return end.call(res, string, encoding);
      }

      if (res.data !== undefined) {
        injected = true;

        // Include, if necessary, replacing the entire res.data with the included snippet.
        if (asEarlyAsPossible === true) {
          // Reverse string and regex to fake a negative look-behind
          res.data = callReversed(res.data, function(text) {
            return text.replace(/>daeh<(?![\s\S]*>daeh<)/i, function(w) {
              return reverse(snippet) + w;
            });
          });
        } else {
          res.data = res.data.replace(/<\/body>(?![\s\S]*<\/body>)/i, function(w) {
            return snippet + w;
          });
        }

        // Write Content-Length
        if (!res.headersSent) {
          res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
        }
      }

      end.call(res, res.data, encoding);
    };

    next();
  };
};
