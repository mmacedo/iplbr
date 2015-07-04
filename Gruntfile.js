/* jshint node: true */

module.exports = function (grunt) {
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
        config: ".jscsrc"
      }
    },
    watch: {
      'public': {
        files: [ 'public/**/*' ],
        options: {
          livereload: 35730
        }
      },
      jasmine: {
        files: [ 'public/js/app/*', 'spec/helpers/*.js', 'spec/*.js' ],
        tasks: 'jasmine:server:build',
        options: {
          livereload: 35731
        }
      }
    },
    connect: {
      'public': {
        options: {
          port: 9393,
          base: 'public',
          livereload: 35730
        }
      },
      jasmine_server: {
        options: {
          port : 8989,
          base: {
            path: '.',
            options: {
              index: 'tmp/_ServerSpecRunner.html'
            }
          },
          livereload: 35731
        }
      },
      jasmine_manual: {
        options: {
          port : 8890
        }
      }
    },
    jasmine: {
      server: {
        src: [
          'public/js/app/configuracao.js',
          'public/js/app/serie.js'
        ],
        options: {
          helpers: 'spec/helpers/**/*.js',
          specs:   'spec/**/*[sS]pec.js',
          vendor:  'public/js/lodash.min.js',
          outfile: 'tmp/_ServerSpecRunner.html',
          host:    'http://127.0.0.1:8989/'
        }
      },
      all: {
        src: [
          'public/js/app/configuracao.js',
          'public/js/app/serie.js'
        ],
        options: {
          helpers: 'spec/helpers/**/*.js',
          specs:   'spec/**/*[sS]pec.js',
          vendor:  'public/js/lodash.min.js',
          outfile: 'tmp/_SpecRunner.html',
          host:    'http://127.0.0.1:8890/'
        }
      }
    },
    concurrent: {
      'public': {
        tasks: [ 'watch:public', 'connect:public:keepalive' ],
        options: {
          logConcurrentOutput: true
        }
      },
      jasmine: {
        tasks: [ 'watch:jasmine', 'connect:jasmine_server:keepalive' ],
        options: {
          logConcurrentOutput: true
        }
      },
      servers: {
        tasks: [ 'server:public', 'server:jasmine' ],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.registerTask('server:public', 'concurrent:public');
  grunt.registerTask('server:jasmine', [ 'jasmine:server:build', 'concurrent:jasmine' ]);
  grunt.registerTask('server', 'concurrent:servers');

  grunt.registerTask('check', [ 'htmllint', 'bootlint', 'jshint', 'jscs' ]);
  grunt.registerTask('test', [ 'connect:jasmine_manual', 'jasmine:all' ]);
  grunt.registerTask('default', [ 'check', 'test' ]);
};
