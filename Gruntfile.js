/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmllint: {
      all: 'public/index.html'
    },
    bootlint: {
      all: 'public/index.html'
    },
    jshint: {
      app: [ 'Gruntfile.js', 'public/js/app/**/*.js' ],
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
      app: [ 'Gruntfile.js', 'public/js/app/**/*.js' ],
      spec: 'spec/*.js',
      options: {
        config: '.jscsrc'
      }
    },
    preprocess: {
      html: {
        src: 'public/index.html',
        dest: 'tmp/index.html'
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
        src: 'tmp/index.html',
        dest: 'tmp/index.html'
      },
      options: {
      }
    },
    uglify: {
      app: {
        files: {
          'tmp/app.min.js': [
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
          { 'tmp/build/index.html': 'tmp/index.html' },
          { 'tmp/build/js/big.min.js': 'public/js/big.min.js' },
          { 'tmp/build/js/app.min.js': 'tmp/app.min.js' },
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
    watch: {
      public: {
        files: [ 'public/**/*' ],
        options: {
          livereload: 35730
        }
      },
      dist: {
        files: [ 'tmp/build/**/*' ],
        options: {
          livereload: 35731
        }
      },
      karma: {
        files: [ 'public/js/app/**/*.js', 'spec/*.js' ],
        tasks: 'karma:runner:run',
      }
    },
    connect: {
      public: {
        options: {
          port: 9393,
          base: 'public',
          livereload: 35730
        }
      },
      dist: {
        options: {
          port: 9494,
          base: 'tmp/build',
          livereload: 35731
        }
      }
    },
    karma: {
      ci: {
        port: 8990,
        singleRun: true
      },
      runner: {
        port: 8989,
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
    }
  });

  grunt.registerTask('check-html', [ 'htmllint', 'bootlint' ]);
  grunt.registerTask('check-js', [ 'jshint', 'jscs' ]);
  grunt.registerTask('test', 'karma:ci:start');

  grunt.registerTask('minify-html', [ 'preprocess:html', 'htmlmin:app' ]);
  grunt.registerTask('minify-js', 'uglify:app');
  grunt.registerTask('build', [ 'minify-html', 'minify-js', 'clean:dist', 'copy:dist' ]);

  grunt.registerTask('server', [ 'connect:public', 'watch:public' ]);
  grunt.registerTask('server:dist', [ 'connect:dist', 'watch:dist' ]);
  grunt.registerTask('runner', [ 'karma:runner:start', 'watch:karma' ]);
};
