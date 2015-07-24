module.exports = function(config) {
  config.set({
    files: [
      // Dependências
      'public/js/lodash.min.js',
      // Código
      'public/js/app/ipl.js',
      'public/js/app/eleicoes.js',
      'public/js/app/esfera.js',
      'public/js/app/cargo.js',
      'public/js/app/composto.js',
      'public/js/app/partidos.js',
      'public/js/app/configuracao.js',
      'public/js/app/cores.js',
      'public/js/app/series.js',
      // Testes
      'spec/**/*_spec.js'
    ],
    frameworks: [ 'mocha', 'chai', 'dirty-chai', 'sinon-chai' ],
    browsers: [ 'PhantomJS' ],
    reportSlowerThan: 10,
    reporters: [ 'mocha', 'html', 'coverage' ],
    preprocessors: {
      'public/js/app/*.js': [ 'coverage' ]
    },
    htmlReporter: {
      outputDir: 'tmp/spec'
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
