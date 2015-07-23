/* globals ipl, _ */
/* exported ipl.RepositorioEleitoral */

;(function(ipl, _) {
  'use strict';

  /**
   * Sigla de um estado ou distrito federal ou BR para Brasil.
   * Expressão regular: /^[a-z]{2}$/
   *
   * @typedef {string} ipl.Ue
   */

  /**
   * Uma identificação para um cargo única na UE.
   * Expressão regular: /^[a-z]+(_[a-z]+)*$/
   *
   * @typedef {string} ipl.IdCargo
   */

  /**
   * Um objeto de parâmetro para filtrar as UEs para calcular o índice.
   *
   * @typedef {Object} ipl.TipoDeEleicao
   * @property {IdCargo} cargo
   * @property {Ue} ue
   */

  /**
   * Um número de representando um ano de eleição ou mandato.
   * Expressão regular: /^(19[8-9]|20[0-1])[0-9]$/
   *
   * @typedef {number} ipl.Ano
   */

  /**
   * Uma identificação para um partido única no ano.
   * Expressão regular: /^[A-Z]{2,}(do[A-Z])?[0-9]{2}$/
   *
   * @typedef {string} ipl.IdPartido
   */

  /**
   * @classdesc Classe para pesquisa de dados dos resultados das eleições.
   *
   * @alias ipl.RepositorioEleitoral
   * @constructor
   * @param {Object} json - {@link RepositorioEleitoral~json}
   */
  function RepositorioEleitoral(json) {
    /**
     * Fonte de dados JSON.
     * @member {Object} ipl.RepositorioEleitoral~json
     */
    this.json = json;
    /**
     * Cache para memoizar o resultado de algumas funções.
     * @member {ipl.Cache} ipl.RepositorioEleitoral~cache
     */
    this.cache = new ipl.Cache();
  }

  RepositorioEleitoral.prototype = {

    /**
     * Busca anos que teve eleição.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @returns {Array<ipl.Ano>}
     * @nosideeffects
     */
    anosDeEleicao: function(tipoDeEleicao) {
      var metodo = 'anosDeEleicao';
      var chave = metodo + tipoDeEleicao.cargo + tipoDeEleicao.ue;
      if (!this.cache.has(chave)) {
        var anosString = _.keys(this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo]);
        var anos = _.map(anosString, function(ano) { return +ano; });
        this.cache.set(chave, anos);
        return anos;
      }
      return this.cache.get(chave);
    },

    /**
     * Busca anos que teve eleição em que o mandato do representante eleito está
     * ativo no ano especificado.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @param {ipl.Ano} ano
     * @returns {Array<ipl.Ano>}
     * @nosideeffects
     */
    mandatosAtivos: function(tipoDeEleicao, ano) {
      var metodo = 'mandatosAtivos';
      var chave = metodo + tipoDeEleicao.cargo + tipoDeEleicao.ue + ano;
      if (!this.cache.has(chave)) {
        var anos = this.anosDeEleicao(tipoDeEleicao);
        var ativos = _.filter(anos, function(anoDeEleicao) {
          if (anoDeEleicao + 1 > ano) {
            return false;
          }
          var eleicao = this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo][anoDeEleicao];
          var duracao = eleicao.mandato;
          if (anoDeEleicao + 1 + duracao <= ano) {
            return false;
          }
          return true;
        }, this);
        this.cache.set(chave, ativos);
        return ativos;
      }
      return this.cache.get(chave);
    },

    /**
     * Busca partidos que tem representantes.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @param {ipl.Ano} ano
     * @returns {Array<ipl.IdPartido>}
     * @nosideeffects
     */
    partidosComRepresentantes: function(tipoDeEleicao, ano) {
      var metodo = 'partidosComRepresentantes';
      var chave = metodo + tipoDeEleicao.cargo + tipoDeEleicao.ue + ano;
      if (!this.cache.has(chave)) {
        var eleicao = this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo][ano];
        var partidos = eleicao && eleicao.por_sigla ? _.keys(eleicao.por_sigla) : [];
        this.cache.set(chave, partidos);
        return partidos;
      }
      return this.cache.get(chave);
    },

    /**
     * Quantidade total de representantes.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @param {ipl.Ano} ano
     * @returns {number}
     * @nosideeffects
     */
    total: function(tipoDeEleicao, ano) {
      var eleicao = this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo][ano];
      return eleicao.total;
    },

    /**
     * Estimativa de população da UE.
     *
     * @param {Ue} ue
     * @param {ipl.Ano} ano
     * @returns {number}
     * @nosideeffects
     */
    populacao: function(ue, ano) {
      var populacao = this.json[ue].populacao[ano];
      if (populacao == null) {
        throw 'Estimativa de população não encontrada para ' + ue + ' em ' + ano + '!';
      }
      return populacao;
    },

    /**
     * Quantidade de representantes eleitos pelo partido.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @param {ipl.Ano} ano
     * @param {ipl.IdPartido} partido
     * @returns {number}
     * @nosideeffects
     */
    quantidade: function(tipoDeEleicao, ano, partido) {
      var eleicao = this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo][ano];
      if (eleicao == null ||
          eleicao.por_sigla == null ||
          eleicao.por_sigla[partido] == null) {
        return 0;
      }
      var partidoNoAno = eleicao.por_sigla[partido];
      return partidoNoAno.quantidade != null ? partidoNoAno.quantidade : partidoNoAno;
    },

    /**
     * Estimativa de população representada pelo partido calculada proporcional
     * aos representantes eleitos pelo partido em cada UE.
     *
     * @param {ipl.TipoDeEleicao} tipoDeEleicao
     * @param {ipl.Ano} ano
     * @param {ipl.IdPartido} partido
     * @returns {number}
     * @nosideeffects
     */
    proporcionalAPopulacao: function(tipoDeEleicao, ano, partido) {
      var eleicao = this.json[tipoDeEleicao.ue][tipoDeEleicao.cargo][ano];
      if (eleicao == null ||
          eleicao.por_sigla == null ||
          eleicao.por_sigla[partido] == null) {
        return 0;
      }
      return eleicao.por_sigla[partido].populacao;
    }

  };

  ipl.RepositorioEleitoral = RepositorioEleitoral;

})(ipl, _);
