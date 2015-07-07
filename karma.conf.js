module.exports = function(config) {
  config.set({
    files: [
      'public/js/lodash.min.js',
      'public/js/app/eleicao.js',
      'public/js/app/indice.js',
      'public/js/app/partido.js',
      'public/js/app/configuracao.js',
      'public/js/app/serie.js',
      'spec/helpers/**/*.js',
      'spec/**/*_spec.js'
    ],
    frameworks: [ 'jasmine' ],
    browsers: [ 'PhantomJS' ],
    reporters: [ 'spec', 'coverage' ],
    preprocessors: {
      'public/js/app/*.js': [ 'coverage' ]
    },
    coverageReporter: {
      type: 'html',
      dir: 'tmp/coverage'
    }
  });
};