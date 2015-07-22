/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var inject    = require('./dashboard/connect-inject');
  var serveFile = require('./dashboard/connect-serve-file');
  var serveText = require('./dashboard/connect-serve-text');

  function tabMiddlewares(livereloadPort) {
    return function(connect, options, middlewares) {
      // Inject iframeResizer.contentWindow.min.js and serve it
      var iframeResizer = 'iframeResizer.contentWindow.min.js';
      middlewares.unshift([ '/' + iframeResizer, serveFile('./dashboard/' + iframeResizer) ]);
      middlewares.unshift(inject('<script src="/' + iframeResizer + '"></script>'));
      // Inject livereload.js
      var livereloadUrl = 'http://localhost:' + livereloadPort + '/livereload.js?snipver=1';
      var livereloadScriptTag = '<script src="' + livereloadUrl + '"><\\/script>';
      middlewares.unshift(inject("<script>document.write('" + livereloadScriptTag + "');</script>"));
      // Return modified stack
      return middlewares;
    };
  }

  var PORT_KARMA_RUNNER        = 8901;
  var PORT_KARMA_CI            = 8902;

  var PORT_LIVERELOAD_SPECS    = 9802;
  var PORT_LIVERELOAD_COVERAGE = 9803;
  var PORT_LIVERELOAD_DOCS     = 9804;
  var PORT_LIVERELOAD_PUBLIC   = 9805;
  var PORT_LIVERELOAD_DIST     = 9806;

  var PORT_CONNECT_SPECS       = 9902;
  var PORT_CONNECT_COVERAGE    = 9903;
  var PORT_CONNECT_DOCS        = 9904;
  var PORT_CONNECT_PUBLIC      = 9905;
  var PORT_CONNECT_DIST        = 9906;
  var PORT_CONNECT_DASHBOARD   = 9999;

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
        port: PORT_KARMA_CI,
        singleRun: true
      },
      runner: {
        port: PORT_KARMA_RUNNER,
        background: true
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
            'public/js/app/eleicao.js',
            'public/js/app/indice.js',
            'public/js/app/cargo.js',
            'public/js/app/composto.js',
            'public/js/app/partido.js',
            'public/js/app/configuracao.js',
            'public/js/app/serie.js',
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
        src: [ 'public/js/app/*.js', 'spec/*_spec.js' ],
        options: {
          destination: 'tmp/doc'
        }
      }
    },
    watch: {
      karma: {
        files: [ 'karma.conf.js', 'public/js/app/*.js', 'spec/*.js' ],
        tasks: 'karma:runner:run',
      },
      specs: {
        files: [ 'tmp/spec/PhantomJS 1.9.8 (Linux 0.0.0)/**/*' ],
        options: { livereload: PORT_LIVERELOAD_SPECS }
      },
      coverage: {
        files: [ 'tmp/coverage/report-html/**/*' ],
        options: { livereload: PORT_LIVERELOAD_COVERAGE }
      },
      docs: {
        files: [ 'public/js/app/*.js', 'spec/*.js' ],
        tasks: 'jsdoc',
        options: { livereload: PORT_LIVERELOAD_DOCS }
      },
      public: {
        files: [ 'public/**/*' ],
        options: { livereload: PORT_LIVERELOAD_PUBLIC }
      },
      dist: {
        files: [ 'tmp/build/**/*' ],
        options: { livereload: PORT_LIVERELOAD_DIST }
      }
    },
    connect: {
      specs: {
        options: {
          port: PORT_CONNECT_SPECS,
          base: 'tmp/spec/PhantomJS 1.9.8 (Linux 0.0.0)',
          middleware: tabMiddlewares(PORT_LIVERELOAD_SPECS)
        }
      },
      coverage: {
        options: {
          port: PORT_CONNECT_COVERAGE,
          base: 'tmp/coverage/report-html',
          middleware: tabMiddlewares(PORT_LIVERELOAD_COVERAGE)
        }
      },
      docs: {
        options: {
          port: PORT_CONNECT_DOCS,
          base: 'tmp/doc',
          middleware: tabMiddlewares(PORT_LIVERELOAD_DOCS)
        }
      },
      public: {
        options: {
          port: PORT_CONNECT_PUBLIC,
          base: 'public',
          middleware: tabMiddlewares(PORT_LIVERELOAD_PUBLIC)
        }
      },
      dist: {
        options: {
          port: PORT_CONNECT_DIST,
          base: 'tmp/build',
          middleware: tabMiddlewares(PORT_LIVERELOAD_DIST)
        }
      },
      dashboard: {
        options: {
          port: PORT_CONNECT_DASHBOARD,
          base: 'dashboard/web',
          middleware: function(connect, options, middlewares) {
            function localhost(port) { return 'http://localhost:' + port; }
            middlewares.unshift([ '/tabs.json', serveText(JSON.stringify({
              'Specs':    localhost(PORT_CONNECT_SPECS),
              'Coverage': localhost(PORT_CONNECT_COVERAGE),
              'Docs':     localhost(PORT_CONNECT_DOCS),
              'Dev.':     localhost(PORT_CONNECT_PUBLIC),
              'Prod.':    localhost(PORT_CONNECT_DIST),
            }), 'application/json') ]);
            return middlewares;
          }
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

  grunt.registerTask('runner', [ 'karma:runner:start', 'watch:karma' ]);
  grunt.registerTask('server:specs', [ 'connect:specs', 'watch:specs' ]);
  grunt.registerTask('server:coverage', [ 'connect:coverage', 'watch:coverage' ]);
  grunt.registerTask('server:docs', [ 'jsdoc:app', 'connect:docs', 'watch:docs' ]);
  grunt.registerTask('server', [ 'connect:public', 'watch:public' ]);
  grunt.registerTask('server:dist', [ 'connect:dist', 'watch:dist' ]);
  grunt.registerTask('dashboard', 'connect:dashboard:keepalive');
};
