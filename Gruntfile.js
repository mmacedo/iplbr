/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

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
      app: [ 'Gruntfile.js', 'public/js/app/*' ],
      spec: {
        src: [ 'spec/helpers/*.js', 'spec/*.js' ],
        options: {
          jshintrc: 'spec/.jshintrc'
        }
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jscs: {
      app: [ 'Gruntfile.js', 'public/js/app/*' ],
      spec: [ 'spec/helpers/*.js', 'spec/*.js' ],
      options: {
        config: '.jscsrc'
      }
    },
    watch: {
      public: {
        files: [ 'public/**/*' ],
        options: {
          livereload: 35730
        }
      },
      jasmine: {
        files: [ 'public/js/app/*', 'spec/helpers/*.js', 'spec/*.js' ],
        tasks: 'jasmine:runner:build',
        options: {
          livereload: 35731
        }
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
      runner: {
        options: {
          port: 8989,
          base: {
            path: '.',
            options: {
              index: 'tmp/_ServerSpecRunner.html'
            }
          },
          livereload: 35731
        }
      },
      jasmine: {
        options: {
          port: 8890
        }
      }
    },
    jasmine: {
      all: [
        'public/js/app/eleicao.js',
        'public/js/app/partido.js',
        'public/js/app/configuracao.js',
        'public/js/app/serie.js'
      ],
      options: {
        helpers: 'spec/helpers/**/*.js',
        specs:   'spec/**/*_spec.js',
        vendor:  'public/js/lodash.min.js',
        outfile: 'tmp/_SpecRunner.html',
        host:    'http://127.0.0.1:8890/'
      },
      runner: {
        src: [
          'public/js/app/eleicao.js',
          'public/js/app/partido.js',
          'public/js/app/configuracao.js',
          'public/js/app/serie.js'
        ],
        options: {
          outfile: 'tmp/_ServerSpecRunner.html',
          host:    'http://127.0.0.1:8989/'
        }
      }
    }
  });

  grunt.registerTask('server', [ 'connect:public', 'watch:public' ]);
  grunt.registerTask('runner', [ 'jasmine:runner:build', 'connect:runner', 'watch:jasmine' ]);

  grunt.registerTask('check-html', [ 'htmllint', 'bootlint' ]);
  grunt.registerTask('check-js', [ 'jshint', 'jscs' ]);
  grunt.registerTask('test', [ 'connect:jasmine', 'jasmine:all' ]);
  grunt.registerTask('default', [ 'check-htl', 'check-js', 'test' ]);
};
