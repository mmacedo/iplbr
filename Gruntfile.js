/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var inject    = require('./dashboard/connect-inject');
  var serveFile = require('./dashboard/connect-serve-file');
  var serveText = require('./dashboard/connect-serve-text');

  function abaDoDashboard(livereloadPort) {
    var iframeUrl = 'iframeUrl.js';
    function serveIframeUrl() {
      return [ '/' + iframeUrl, serveFile('./dashboard/' + iframeUrl) ];
    }
    function injetaIframeUrl() {
      return inject('<script src="/' + iframeUrl + '"></script>', true);
    }
    function contaUrlParaDashboard() {
      var envia = 'window.parent.postMessage(window.location,"*");';
      var script =
        'if(window.parent){' +
         envia +
        'setInterval(function(){' + envia + '},100);' +
        '}';
      return inject('<script>' + script + '</script>', true);
    }
    var iframeResizer = 'iframeResizer.contentWindow.min.js';
    function serveIframeResizer() {
      return [ '/' + iframeResizer, serveFile('./dashboard/' + iframeResizer) ];
    }
    function injetaIframeResizer() {
      return inject('<script src="/' + iframeResizer + '"></script>');
    }
    function injetaLiveReload() {
      var livereloadUrl = 'http://localhost:' + livereloadPort;
      var livereloadScriptTag =
        '<script src="' + livereloadUrl + '/livereload.js?snipver=1">' +
        '<\\/script>';
      var escreveTagDoLivereload =
        '<script>' +
        'document.write(\'' + livereloadScriptTag + '\');' +
        '</script>';
      return inject(escreveTagDoLivereload);
    }
    return function(connect, options, middlewares) {
      middlewares.unshift(serveIframeUrl());
      middlewares.unshift(injetaIframeUrl());
      middlewares.unshift(serveIframeResizer());
      middlewares.unshift(injetaIframeResizer());
      middlewares.unshift(injetaLiveReload());
      return middlewares;
    };
  }

  function localhost(port) { return 'http://localhost:' + port; }

  var _ = require('lodash');

  function dashboard(directory, tabs) {
    return function(connect, options, middlewares) {
      _.forOwn(tabs, function(url, tab) {
        middlewares.unshift([
          '/' + _.kebabCase(tab),
          serveFile(directory + '/index.html', 'text/html')
        ]);
      });
      middlewares.unshift([
        '/tabs.json',
        serveText(JSON.stringify(tabs), 'application/json')
      ]);
      return middlewares;
    };
  }

  var PORTA_KARMA_RUNNER        = 8901;
  var PORTA_KARMA_CI            = 8902;

  var PORTA_LIVERELOAD_SPECS    = 9802;
  var PORTA_LIVERELOAD_COVERAGE = 9803;
  var PORTA_LIVERELOAD_DOCS     = 9804;
  var PORTA_LIVERELOAD_PUBLIC   = 9805;
  var PORTA_LIVERELOAD_DIST     = 9806;

  var PORTA_CONNECT_SPECS       = 9902;
  var PORTA_CONNECT_COVERAGE    = 9903;
  var PORTA_CONNECT_DOCS        = 9904;
  var PORTA_CONNECT_PUBLIC      = 9905;
  var PORTA_CONNECT_DIST        = 9906;
  var PORTA_CONNECT_DASHBOARD   = 9999;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmllint: {
      all: 'public/index.html'
    },
    bootlint: {
      all: 'public/index.html'
    },
    jshint: {
      app: [ 'Gruntfile.js', 'public/js/app/*.js' ],
      spec: {
        src: 'spec/*.js',
        options: {
          jshintrc: 'spec/.jshintrc'
        }
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jscs: {
      app: [ 'Gruntfile.js', 'public/js/app/*.js' ],
      spec: 'spec/*.js',
      options: {
        config: '.jscsrc'
      }
    },
    karma: {
      ci: {
        port: PORTA_KARMA_CI,
        singleRun: true
      },
      runner: {
        port: PORTA_KARMA_RUNNER,
        autoWatch: true
      },
      options: {
        configFile: 'karma.conf.js'
      }
    },
    coveralls: {
      src: 'tmp/coverage/report-lcov/lcov.info',
      options: {
        force: true
      }
    },
    preprocess: {
      html: {
        src: 'public/index.html',
        dest: 'tmp/min/index.html'
      }
    },
    htmlmin: {
      app: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true
        },
        src: 'tmp/min/index.html',
        dest: 'tmp/min/index.html'
      },
      options: {
      }
    },
    uglify: {
      app: {
        files: {
          'tmp/min/app.min.js': [
            'public/js/ie10-viewport-bug-workaround.js',
            'public/js/app/ipl.js',
            'public/js/app/eleicoes.js',
            'public/js/app/indices.js',
            'public/js/app/esfera.js',
            'public/js/app/cargo.js',
            'public/js/app/composto.js',
            'public/js/app/partidos.js',
            'public/js/app/configuracao.js',
            'public/js/app/cores.js',
            'public/js/app/series.js',
            'public/js/app/grafico.js',
            'public/js/app/main.js'
          ]
        }
      },
      options: {
        screwIE8: true
      }
    },
    clean: {
      dist: 'tmp/build'
    },
    copy: {
      dist: {
        files: [
          { 'tmp/build/index.html': 'tmp/min/index.html' },
          { 'tmp/build/js/big.min.js': 'public/js/big.min.js' },
          { 'tmp/build/js/app.min.js': 'tmp/min/app.min.js' },
          { 'tmp/build/eleitos.json': 'public/eleitos.json' },
          {
            dest: 'tmp/build/favicons/',
            src: 'public/favicons/*',
            expand: true,
            flatten: true
          }
        ]
      }
    },
    jsdoc: {
      app: {
        src: 'public/js/app/*.js',
        options: {
          destination: 'tmp/doc',
          configure: 'jsdoc.conf.json'
        }
      }
    },
    watch: {
      specs: {
        files: [ 'tmp/spec/PhantomJS 1.9.8 (Linux 0.0.0)/**/*' ],
        options: { livereload: PORTA_LIVERELOAD_SPECS }
      },
      coverage: {
        files: [ 'tmp/coverage/report-html/**/*' ],
        options: { livereload: PORTA_LIVERELOAD_COVERAGE }
      },
      docs: {
        files: [ 'public/js/app/*.js', 'spec/*.js' ],
        tasks: 'jsdoc',
        options: { livereload: PORTA_LIVERELOAD_DOCS }
      },
      public: {
        files: [ 'public/**/*' ],
        options: { livereload: PORTA_LIVERELOAD_PUBLIC }
      },
      dist: {
        files: [ 'tmp/build/**/*' ],
        options: { livereload: PORTA_LIVERELOAD_DIST }
      }
    },
    connect: {
      specs: {
        options: {
          port: PORTA_CONNECT_SPECS,
          base: 'tmp/spec/PhantomJS 1.9.8 (Linux 0.0.0)',
          middleware: abaDoDashboard(PORTA_LIVERELOAD_SPECS)
        }
      },
      coverage: {
        options: {
          port: PORTA_CONNECT_COVERAGE,
          base: 'tmp/coverage/report-html',
          middleware: abaDoDashboard(PORTA_LIVERELOAD_COVERAGE)
        }
      },
      docs: {
        options: {
          port: PORTA_CONNECT_DOCS,
          base: 'tmp/doc',
          middleware: abaDoDashboard(PORTA_LIVERELOAD_DOCS)
        }
      },
      public: {
        options: {
          port: PORTA_CONNECT_PUBLIC,
          base: 'public',
          middleware: abaDoDashboard(PORTA_LIVERELOAD_PUBLIC)
        }
      },
      dist: {
        options: {
          port: PORTA_CONNECT_DIST,
          base: 'tmp/build',
          middleware: abaDoDashboard(PORTA_LIVERELOAD_DIST)
        }
      },
      dashboard: {
        options: {
          port: PORTA_CONNECT_DASHBOARD,
          base: 'dashboard/web',
          middleware: dashboard('dashboard/web', {
            Specs:    localhost(PORTA_CONNECT_SPECS),
            Coverage: localhost(PORTA_CONNECT_COVERAGE),
            Docs:     localhost(PORTA_CONNECT_DOCS),
            'Dev.':   localhost(PORTA_CONNECT_PUBLIC),
            'Prod.':  localhost(PORTA_CONNECT_DIST),
          })
        }
      }
    },
    concurrent: {
      dashboard: {
        tasks: [
          'runner',
          'serve:specs',
          'serve:coverage',
          'serve:docs',
          'serve',
          'serve:dist',
          'connect:dashboard:keepalive'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.registerTask('check-html', [ 'htmllint', 'bootlint' ]);
  grunt.registerTask('check-js', [ 'jshint', 'jscs' ]);
  grunt.registerTask('test', 'karma:ci:start');

  grunt.registerTask('default', [ 'check-html', 'check-js', 'test', 'jsdoc' ]);

  grunt.registerTask('minify-html', [ 'preprocess:html', 'htmlmin:app' ]);
  grunt.registerTask('minify-js', 'uglify:app');
  grunt.registerTask('build', [ 'minify-html', 'minify-js', 'clean:dist', 'copy:dist' ]);

  grunt.registerTask('runner', 'karma:runner:start');
  grunt.registerTask('serve:specs', [ 'connect:specs', 'watch:specs' ]);
  grunt.registerTask('serve:coverage', [ 'connect:coverage', 'watch:coverage' ]);
  grunt.registerTask('serve:docs', [ 'jsdoc:app', 'connect:docs', 'watch:docs' ]);
  grunt.registerTask('serve', [ 'connect:public', 'watch:public' ]);
  grunt.registerTask('serve:dist', [ 'connect:dist', 'watch:dist' ]);
  grunt.registerTask('dashboard', 'concurrent:dashboard');
};
