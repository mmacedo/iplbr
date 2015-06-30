/* global _ */

(function(_) {
  'use strict';

  // https://github.com/jasmine/jasmine/issues/592
  beforeEach(function () {

    jasmine.addMatchers({
      toEqualIgnoringNulls: function (utils, customEqualityTesters) {
        return {
          compare: function (efetivo, esperado) {

            var efetivoSemNulls  = removerNulls(efetivo);
            var esperadoSemNulls = removerNulls(esperado);

            var resultado = { pass: utils.equals(efetivoSemNulls, esperadoSemNulls, customEqualityTesters) };
            if (!resultado.pass) {
              resultado.message = "Expected " + JSON.stringify(efetivoSemNulls) + " toEqualIgnoringNulls " + JSON.stringify(esperadoSemNulls);
            }

            return resultado;

          }
        };
      }
    });

  });

  /**
   * remover chave quando valor é null
   * @param {Object} obj
   * @returns {Object}
   */
  function removerNulls(obj){

    var copia = _.cloneDeep(obj);

    percorrer(copia, function(chave, valor, pai) {
      if (valor == null) {
        delete pai[chave];
      }
    });

    return copia;

  }

  /**
   * percorrer objeto
   * @param {Object} obj
   * @param {Function} callback as function(chave, valor, pai)
   * @param {Array} [caminho]
   */
  function percorrer(obj, callback) {

    _.forOwn(obj, function(valor, chave) {

      callback.apply(this, [chave, valor, obj]);

      // Se não é folha
      if (valor instanceof Object && !(valor instanceof Array)) {
        percorrer(valor, callback);
      }

    });

  }
})(_);
