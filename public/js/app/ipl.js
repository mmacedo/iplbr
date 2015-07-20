(function() {
  'use strict';

  function SimpleMap() {
    this.clear();
  }

  SimpleMap.prototype = {

    has: function(chave) {
      return chave in this.__data__;
    },

    get: function(chave) {
      return this.__data__[chave];
    },

    set: function(chave, valor) {
      this.__data__[chave] = valor;
    },

    'delete': function(chave) {
      delete this.__data__[chave];
    },

    clear: function() {
      this.__data__ = Object.create(null);
    }

  };

  /**
   * Namespace para o código da aplicação.
   *
   * @namespace ipl
   */
  this.ipl = { Cache: SimpleMap };

}.call(this));
