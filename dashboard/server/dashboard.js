/* jshint node: true */

'use strict';

var _         = require('lodash');
var inject    = require('./connect-inject');
var serveFile = require('./connect-serve-file');
var serveText = require('./connect-serve-text');

function injectDashboardTab(middlewares, livereloadPort) {
  // Inject and serve script that tell the parent its URL
  var serveIframeUrl = [ '/iframeUrl.js', serveFile('../iframe/iframeUrl.js') ];
  var injectIframeUrl = inject('<script src="/iframeUrl.js"></script>', true);
  middlewares.unshift(serveIframeUrl);
  middlewares.unshift(injectIframeUrl);

  // Inject and serve script that tell the parent its height
  var iframeResizer = 'iframeResizer.contentWindow.min.js';
  var serveIframeResizer = [ '/' + iframeResizer, serveFile('../iframe/' + iframeResizer) ];
  var injectIframeResizer = inject('<script src="/' + iframeResizer + '"></script>');
  middlewares.unshift(serveIframeResizer);
  middlewares.unshift(injectIframeResizer);

  // Inject LiveReload since the one in grunt-contrib-connect duplicates the whole page
  var livereloadUrl = 'http://localhost:' + livereloadPort;
  var livereloadScriptTag =
    '<script src="' + livereloadUrl + '/livereload.js?snipver=1">' +
    '<\\/script>';
  var escreveTagDoLivereload =
    '<script>' +
    'document.write(\'' + livereloadScriptTag + '\');' +
    '</script>';
  var injectLiveReload = inject(escreveTagDoLivereload);
  middlewares.unshift(injectLiveReload);
}

function injectDashboard(middlewares, tabs) {
  var serveIndex = serveFile('../web/index.html', 'text/html');
  // Serve index for each tab
  _.forOwn(tabs, function(url, tab) {
    middlewares.unshift([ '/' + _.kebabCase(tab), serveIndex ]);
  });
  // Serve JSON with tab configuration
  middlewares.unshift([
    '/tabs.json',
    serveText(JSON.stringify(tabs), 'application/json')
  ]);
}

module.exports = {
  injectDashboardTab: injectDashboardTab,
  injectDashboard: injectDashboard
};
