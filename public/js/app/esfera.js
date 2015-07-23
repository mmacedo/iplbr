/* globals ipl, _ */
/* exported ipl.EsferaFederal */
/* exported ipl.EsferaEstadual */
/* exported ipl.EsferaDistrital */
/* exported ipl.EsferaMunicipal */

;(function(ipl, _) {
  'use strict';

  /**
   * Um objeto de parâmetro para filtrar as UEs para calcular o índice.
   *
   * @typedef {Object} ipl.Regiao
   * @property {Array<ipl.Ue>} ues - Lista de UEs da região.
   * @property {string} nome   - Nome da região.
   */

  /**
   * Interface para um objeto que determina as UEs da esfera.
   *
   * @name ipl.Esfera
   * @interface
   */
  /**
   * Retornar UEs que tem o cargo representando a região.
   *
   * @method ipl.Esfera#uesComDados
   * @param {ipl.Regiao} regiao
   * @returns {Array<ipl.Ue>}
   */
  /**
   * Retornar UEs que tem eleição para o cargo na região.
   *
   * @method ipl.Esfera#todasAsUes
   * @param {ipl.Regiao} regiao
   * @returns {Array<ipl.Ue>}
   */
  /**
   * @classdesc Esfera federal.
   *
   * @alias ipl.EsferaFederal
   * @constructor
   * @implements {ipl.Esfera}
   */
  function EsferaFederal() {}

  EsferaFederal.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function() {
      // Ignora as UFs, só é necessário um valor para qualquer UF ou município
      return [ 'BR' ];
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUes: function() {
      // Ignora as UFs, só é necessário um valor para qualquer UF ou município
      return [ 'BR' ];
    }

  };

  /**
   * @classdesc Esfera estadual (exceto DF).
   *
   * @alias ipl.EsferaEstadual
   * @constructor
   * @implements {ipl.Esfera}
   */
  function EsferaEstadual() {}

  EsferaEstadual.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(regiao.ues, 'DF');
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUes: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  /**
   * @classdesc Esfera estadual/municipal para DF.
   *
   * @alias ipl.EsferaDistrital
   * @constructor
   * @implements {ipl.Esfera}
   */
  function EsferaDistrital() {}

  EsferaDistrital.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só o distrito federal, depois soma com o estadual
      return _.contains(regiao.ues, 'DF') ? [ 'DF' ] : [];
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUes: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  /**
   * @classdesc Esfera municipal (exceto DF).
   *
   * @alias ipl.EsferaMunicipal
   * @constructor
   * @implements {ipl.Esfera}
   */
  function EsferaMunicipal() {}

  EsferaMunicipal.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(regiao.ues, 'DF');
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUes: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  ipl.EsferaFederal   = EsferaFederal;
  ipl.EsferaEstadual  = EsferaEstadual;
  ipl.EsferaDistrital = EsferaDistrital;
  ipl.EsferaMunicipal = EsferaMunicipal;

})(ipl, _);
