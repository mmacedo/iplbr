/* exported ipl, ipl.Cache */

/**
 * Namespace para o código da aplicação.
 * @namespace ipl
 */

;(function(root) {
  'use strict';

  /**
   * @classdesc
   * Imitação minimalista de Map do ES6.
   *
   * @alias ipl.Cache
   * @constructor
   */
  function SimpleMap() {
    this.clear();
    /**
     * Número de entradas no cache.
     * @member {number} ipl.Cache#size
     */
    /**
     * Objeto onde são guardadas as entradas do cache.
     * @member {Object} ipl.Cache~__data__
     */
  }

  SimpleMap.prototype = {

    /**
     * Verifica se há entrada no cache.
     *
     * @param {string} chave
     * @returns {boolean}
     * @nosideeffects
     */
    has: function(chave) {
      return chave in this.__data__;
    },

    /**
     * Retorna entrada do cache.
     *
     * @param {string} chave
     * @returns {*}
     * @nosideeffects
     */
    get: function(chave) {
      return this.__data__[chave];
    },

    /**
     * Altera entrada do cache.
     *
     * @param {string} chave
     * @param {*} valor
     */
    set: function(chave, valor) {
      if (!this.has(chave)) {
        this.size++;
      }
      this.__data__[chave] = valor;
    },

    /**
     * Remove entrada do cache.
     *
     * @param {string} chave
     */
    delete: function(chave) {
      if (this.has(chave)) {
        this.size--;
        delete this.__data__[chave];
      }
    },

    /**
     * Remove todas as entradas do cache.
     */
    clear: function() {
      this.size = 0;
      this.__data__ = Object.create(null);
    }

  };

  var ipl = root.ipl = {};
  ipl.Cache = SimpleMap;

})(this);
