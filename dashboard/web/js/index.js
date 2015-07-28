/* jshint browser: true, jquery: true */
/* global _ */

jQuery(function($) {
  'use strict';

  var templates = {};
  $('script[type="application/lodash-template"]').each(function() {
    var $el = $(this);
    var id = _.camelCase($el.attr('id').replace(/^template-/, ''));
    templates[id] = _.template($el.text());
  });

  $.getJSON('/tabs.json').done(function(json) {
    var $nav  = $('#navbar > ul.nav').empty();
    var $tabs = $('#content').empty();
    _.each(json, function(value, key) {
      // Add tab
      var title = key, id = _.kebabCase(title), url = value;
      var context = { id: id, title: title, url: url };
      $nav.append(templates.nav(context));
      $tabs.append(templates.tab(context));

      var $url        = $('#' + id + ' .url');
      var $urlOpen    = $('#open_current_' + id);
      var $urlRefresh = $('#refresh_current_' + id);
      var $iframe     = $('#' + id + ' > iframe');
      var $led        = $('#show_' + id + ' .led');

      var updateLed = _.debounce(function updateLed() {
        var colour = !$iframe.data('loadFired') ?
          'yellow' :
          $iframe.data('isUp') ? 'green' : 'red';
        $led.attr('class', 'led led-' + colour);
      }, 100);

      var lastHref = url;
      function updateUrl(loc) {
        if (loc.href === lastHref) {
          return;
        }
        lastHref = loc.href;
        $urlOpen.attr('href', loc.href);
        $urlRefresh.attr('href', loc.href);
        $url.html(templates.url(loc));
      }

      function reloadIframe() {
        $iframe.load(function() {
          $iframe.data('loadFired', true);
          updateLed();
        })
        .attr('src', url)
        .iFrameResize({ heightCalculationMethod: 'bodyScroll' });
      }

      // Loaded iframe content
      $(window).on('message', function(e) {
        if (e.originalEvent.origin === url) {
          $iframe.data('isUp', true);
          updateLed();
          if (e.originalEvent.data.location) {
            updateUrl(JSON.parse(e.originalEvent.data.location));
          }
        }
      });

      // Refresh button
      $('#refresh_' + id).click(function() {
        $led.attr('class', 'led led-yellow');
        var active = $('#' + id).replaceWith(templates.tab(context)).hasClass('active');
        $iframe = $('#' + id + ' > iframe');
        reloadIframe();
        if (active) {
          $('#' + id).addClass('active');
        }
        return false;
      });

      $urlRefresh.click(function() {
        $iframe.get(0).contentWindow.postMessage('RELOAD', url);
        return false;
      });

      reloadIframe();
    });

    function showTab(tab) {
      $('.tab').removeClass('active');
      $('#navbar .show-button').removeClass('active');
      if (tab != null) {
        $('#' + tab).addClass('active');
        return $('#show_' + tab).addClass('active').find('a').text();
      }
      return null;
    }

    $(document).on('click', '#brand', function(e) {
      if (e.ctrlKey === true || e.shiftKey === true) {
        return;
      }
      showTab(null);
      history.pushState({ tab: null }, 'Dashboard', '/');
      return false;
    });

    $(document).on('click', '#navbar > .nav > .show-button > a', function(e) {
      if (e.ctrlKey === true || e.shiftKey === true) {
        return;
      }
      var tab = $(this).attr('href').replace('/', '');
      history.pushState({ tab: tab }, showTab(tab), '/' + tab);
      // Not good if you are changing tabs often
      return false;
    });

    if (history.state == null) {
      var path = (window.location.pathname || '').replace('/', '');
      var state = { tab: path || null };
      var title = showTab(state.tab);
      if (path.length > 0) {
        history.replaceState(state, title, '/' + path);
      } else {
        history.replaceState(state, title);
      }
    } else {
      showTab(history.state.tab);
    }

    window.onpopstate = function(e) {
      if (e.state == null) {
        return;
      }
      showTab(e.state.tab);
    };

  });
});
