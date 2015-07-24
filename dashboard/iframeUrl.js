if (window.parent) {
  (function() {
    function tellParent() {
      window.parent.postMessage({ location: JSON.stringify(window.location) }, "*");
    }
    tellParent();
    setInterval(tellParent, 100);
    window.addEventListener('message', function(e) {
      if (e.data === 'RELOAD') {
        window.location.reload(true);
      }
    })
  })();
}
