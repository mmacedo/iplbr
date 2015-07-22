module.exports = function connectServeText(text, mimeType) {
  return function serveText(req, res) {
    res.writeHead(200, {
      'Content-Type' : mimeType || 'text/plain',
      'Content-Length': Buffer.byteLength(text)
    });
    res.write(text);
    res.end();
  };
};
