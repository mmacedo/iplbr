module.exports = function(config) {
  config.set({
    files: [
      'public/js/lodash.min.js',
      // 'public/js/big.min.js',
      'public/js/app/ipl.js',
      'public/js/app/eleicao.js',
      'public/js/app/indice.js',
      'public/js/app/cargo.js',
      'public/js/app/composto.js',
      'public/js/app/partido.js',
      'public/js/app/configuracao.js',
      'public/js/app/serie.js',
      // 'public/js/app/grafico.js',
      // 'public/js/app/main.js',
      'spec/**/*_spec.js'
    ],
    frameworks: [ 'mocha', 'chai', 'dirty-chai', 'sinon-chai' ],
    browsers: [ 'PhantomJS' ],
    reportSlowerThan: 10,
    reporters: [ 'mocha', 'coverage' ],
    preprocessors: {
      'public/js/app/*.js': [ 'coverage' ]
    },
    coverageReporter: {
      dir: 'tmp/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    }
  });
};
