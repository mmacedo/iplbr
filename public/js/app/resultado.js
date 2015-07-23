/* globals ipl, _ */
/* exported ipl.ResultadoSemPeso */
/* exported ipl.ResultadoPorPopulacao */

;(function(ipl, _) {
  'use strict';

  /**
   * Interface para um objeto que calcula quantidades e pesos para cada componente
   * do índice.
   *
   * @name ipl.Resultado
   * @interface
   */
  /**
   * Retornar quantidade do componente no ano para a série.
   *
   * @method ipl.Resultado#quantidade
   * @param {ipl.TipoDeEleicao} tipoDeEleicao
   * @param {ipl.Ano} ano
   * @param {ipl.IdPartido} serie
   * @returns {number}
   */
  /**
   * Retornar soma do componente no ano para todas as séries.
   *
   * @method ipl.Resultado#total
   * @param {ipl.TipoDeEleicao} tipoDeEleicao
   * @param {ipl.Ano} ano
   * @returns {number}
   */
  /**
   * Retornar o peso do componente em relação a todos os componentes no ano.
   *
   * @method ipl.Resultado#peso
   * @param {ipl.TipoDeEleicao} tipoDeEleicao
   * @param {ipl.Ano} ano
   * @returns {number}
   */

  /**
   * @classdesc Resultados das eleições com valores nominais (sem peso).
   *
   * @alias ipl.ResultadoSemPeso
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo - {@link ipl.ResultadoSemPeso~repo}
   * @implements {ipl.Resultado}
   */
  function ResultadoSemPeso(repo) {
    /**
     * Fonte de dados eleitorais.
     * @member {Object} ipl.ResultadoSemPeso~repo
     */
    this.repo = repo;
  }

  ResultadoSemPeso.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    quantidade: function(tipoDeEleicao, ano, partido) {
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.quantidade(tipoDeEleicao, eleicao, partido);
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    total: function(tipoDeEleicao, ano) {
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.total(tipoDeEleicao, eleicao);
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    peso: function(tipoDeEleicao, ano) {
      return this.total(tipoDeEleicao, ano);
    }

  };

  /**
   * @classdesc
   * Resultados das eleições com valores proporcionais à população da UE representada.
   *
   * @alias ipl.ResultadoPorPopulacao
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo - {@link ipl.ResultadoPorPopulacao~repo}
   * @implements {ipl.Resultado}
   */
  function ResultadoPorPopulacao(repo) {
    /**
     * Fonte de dados eleitorais.
     * @member {ipl.RepositorioEleitoral} ipl.ResultadoPorPopulacao~repo
     */
    this.repo = repo;
  }

  ResultadoPorPopulacao.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    quantidade: function(tipoDeEleicao, ano, partido) {
      var populacaoDoAno = this.repo.populacao(tipoDeEleicao.ue, ano);
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      var total = _.sum(mandatos, function(eleicao) {
        return this.repo.total(tipoDeEleicao, eleicao);
      }, this);
      return _.sum(mandatos, function(eleicao) {
        var preCalculado = this.repo.proporcionalAPopulacao(tipoDeEleicao, eleicao, partido);
        if (preCalculado === 0) {
          return 0;
        }
        if (preCalculado != null) {
          var populacaoDoAnoDaEleicao = this.repo.populacao(tipoDeEleicao.ue, eleicao);
          return preCalculado * (populacaoDoAno / populacaoDoAnoDaEleicao);
        }
        var quantidade = this.repo.quantidade(tipoDeEleicao, eleicao, partido);
        return (quantidade / total) * populacaoDoAno;
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    total: function(tipoDeEleicao, ano) {
      return this.repo.populacao(tipoDeEleicao.ue, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    peso: function(tipoDeEleicao, ano) {
      return this.repo.populacao(tipoDeEleicao.ue, ano);
    }

  };

  ipl.ResultadoSemPeso      = ResultadoSemPeso;
  ipl.ResultadoPorPopulacao = ResultadoPorPopulacao;

})(ipl, _);
