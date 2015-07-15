/* global _ */
/* exported RepositorioEleitoral */

(function(_) {
  'use strict';

  /**
   * Sigla de um estado ou distrito federal ou BR para Brasil.
   * /^[a-z]{2}$/
   *
   * @typedef {string} Ue
   */

  /**
   * Um número de representando um ano de eleição ou mandato.
   * /^(19[8-9]|20[0-1])[0-9]$/
   *
   * @typedef {number} Ano
   */

  /**
   * Uma identificação para um partido única no ano.
   * /^[A-Z]{2,}(do[A-Z])?[0-9]{2}$/
   *
   * @typedef {string} IdPartido
   */

  /**
   * Uma identificação para um cargo única na UE.
   * /^[a-z]+(_[a-z]+)*$/
   *
   * @typedef {string} IdCargo
   */

  /**
   * @class
   * @classdesc Classe para pesquisa de dados dos resultados das eleições.
   * @param {Object} json - {@link RepositorioEleitoral#json}
   */
  function RepositorioEleitoral(json) {
    /**
     * Fonte de dados JSON.
     *
     * @private
     * @memberOf RepositorioEleitoral.prototype
     * @member {Object}
     */
    this.json  = json;
    /**
     * Cache para memoizar o resultado de algumas funções.
     *
     * @private
     * @memberOf RepositorioEleitoral.prototype
     * @member {Object}
     */
    this.cache = new _.memoize.Cache;
  }

  RepositorioEleitoral.prototype = /** @lends RepositorioEleitoral.prototype */ {

    /**
     * Busca anos que teve eleição.
     *
     * @param {IdCargo} cargo - Filtro por cargo.
     * @param {Ue}      ue    - Filtro por UE.
     * @return {Array<Ano>}
     * @nosideeffects
     */
    anosDeEleicao: function(cargo, ue) {
      var chave = 'anosDeEleicao' + cargo + ue;
      if (!this.cache.has(chave)) {
        var anosString = _.keys(this.json[ue][cargo]);
        var anos = _.map(anosString, function(ano) { return +ano; });
        this.cache.set(chave, anos);
      }
      return this.cache.get(chave);
    },

    /**
     * Busca anos que teve eleição e a duração do mandato do representante eleito.
     *
     * @private
     * @param {IdCargo} cargo - Filtro por cargo.
     * @param {Ue}      ue    - Filtro por UE.
     * @return {Array<{eleicao: Ano, duracao: number}>}
     * @nosideeffects
     */
    mandatos: function(cargo, ue) {
      var chave = 'mandatos' + cargo + ue;
      if (!this.cache.has(chave)) {
        var anos = this.anosDeEleicao(cargo, ue);
        var mandatos = _.map(anos, function(ano) {
          return { eleicao: ano, duracao: this.json[ue][cargo][ano]._mandato };
        }, this);
        this.cache.set(chave, mandatos);
      }
      return this.cache.get(chave);
    },

    /**
     * Busca anos que teve eleição em que o mandato do representante eleito está
     * ativo no ano especificado.
     *
     * @param {IdCargo} cargo - Filtro por cargo.
     * @param {Ue}      ue    - Filtro por UE.
     * @param {Ano}     ano   - Filtro por ano.
     * @return {Array<Ano>}
     * @nosideeffects
     */
    mandatosAtivos: function(cargo, ue, ano) {
      var chave = 'mandatosAtivos' + cargo + ue + ano;
      if (!this.cache.has(chave)) {
        var mandatos = this.mandatos(cargo, ue);
        var ativos = _.filter(mandatos, function(mandato) {
          return mandato.eleicao + 1 <= ano &&
                 mandato.eleicao + 1 + mandato.duracao > ano;
        });
        var anosDeMandatosAtivos = _.pluck(ativos, 'eleicao');
        this.cache.set(chave, anosDeMandatosAtivos);
      }
      return this.cache.get(chave);
    },

    /**
     * Busca partidos que tem representantes.
     *
     * @param {IdCargo} cargo - Filtro por cargo.
     * @param {Ue}      ue    - Filtro por UE.
     * @param {Ano}     ano   - Filtro por ano.
     * @return {Array<IdPartido>}
     * @nosideeffects
     */
    siglasComRepresentantes: function(cargo, ue, ano) {
      var chave = 'siglasComRepresentantes' + cargo + ue + ano;
      if (!this.cache.has(chave)) {
        var chaves   = _.keys(this.json[ue || 'BR'][cargo][ano]);
        var partidos =  _.reject(chaves, function(partido) {
          return _.startsWith(partido, '_');
        });
        this.cache.set(chave, partidos);
      }
      return this.cache.get(chave);
    },

    /**
     * Quantidade total de representantes.
     *
     * @param {IdCargo} cargo - Filtro por cargo.
     * @param {Ue}      ue    - Filtro por UE.
     * @param {Ano}     ano   - Filtro por ano.
     * @return {number}
     * @nosideeffects
     */
    total: function(cargo, ue, ano) {
      return this.json[ue || 'BR'][cargo][ano]._total;
    },

    /**
     * Estimativa de população da UE.
     *
     * @param {Ue}      ue    - Filtro por UE.
     * @param {Ano}     ano   - Filtro por ano.
     * @return {number}
     * @nosideeffects
     */
    populacao: function(ue, ano) {
      return this.json[ue].populacao[ano];
    },

    /**
     * Quantidade de representantes eleitos pelo partido.
     *
     * @param {IdCargo}   cargo   - Filtro por cargo.
     * @param {Ue}        ue      - Filtro por UE.
     * @param {Ano}       ano     - Filtro por ano.
     * @param {IdPartido} partido - Filtro por partido.
     * @return {number}
     * @nosideeffects
     */
    quantidade: function(cargo, ue, ano, partido) {
      var anoNaUe = this.json[ue || 'BR'][cargo][ano];
      if (anoNaUe == null) {
        return 0;
      }
      var siglaNoAno = anoNaUe[partido];
      if (siglaNoAno == null) {
        return 0;
      }
      return siglaNoAno.quantidade != null ? siglaNoAno.quantidade : siglaNoAno;
    },

    /**
     * Estimativa de população representada pelo partido calculada proporcional
     * aos representantes eleitos pelo partido em cada UE.
     *
     * @param {IdCargo}   cargo   - Filtro por cargo.
     * @param {Ue}        ue      - Filtro por UE.
     * @param {Ano}       ano     - Filtro por ano.
     * @param {IdPartido} partido - Filtro por partido.
     * @return {number}
     * @nosideeffects
     */
    proporcionalAPopulacao: function(cargo, ue, ano, partido) {
      var anoNaUe = this.json[ue || 'BR'][cargo][ano];
      if (anoNaUe == null) {
        return 0;
      }
      var siglaNoAno = anoNaUe[partido];
      if (siglaNoAno == null) {
        return 0;
      }
      return siglaNoAno.populacao;
    },

  };

  this.RepositorioEleitoral = RepositorioEleitoral;

}.call(this, _));
