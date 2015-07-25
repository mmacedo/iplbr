/* jshint browser: true */

(function() {
  'use strict';
  function tellParent() {
    window.parent.postMessage({ location: JSON.stringify(window.location) }, '*');
  }
  if (window.parent) {
    tellParent();
    setInterval(tellParent, 100);
    window.addEventListener('message', function(e) {
      if (e.data === 'RELOAD') {
        window.location.reload(true);
      }
    });
  }
})();
