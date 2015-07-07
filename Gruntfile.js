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
      karma: {
        files: [ 'public/js/app/*', 'spec/helpers/*.js', 'spec/*.js' ],
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
    },
    shell: {
      codeclimate: {
        command: 'codeclimate-test-reporter < tmp/coverage/report-lcov/lcov.info'
      }
    }
  });

  grunt.registerTask('codeclimate', 'shell:codeclimate');

  grunt.registerTask('server', [ 'connect:public', 'watch:public' ]);
  grunt.registerTask('runner', [ 'karma:runner:start', 'watch:karma' ]);

  grunt.registerTask('check-html', [ 'htmllint', 'bootlint' ]);
  grunt.registerTask('check-js', [ 'jshint', 'jscs' ]);
  grunt.registerTask('test', 'karma:ci:start');
  grunt.registerTask('default', [ 'check-html', 'check-js', 'test' ]);
};
