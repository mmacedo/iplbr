/* globals ipl, _ */
/* exported ipl.Cargo */
/* exported ipl.IndicePorCargo */

;(function(ipl, _) {
  'use strict';

  /**
   * @classdesc Objeto com resultados das eleições para um cargo.
   *
   * @alias ipl.Cargo
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo   - {@link ipl.Cargo~repo}
   * @param {ipl.IdCargo} idCargo             - {@link ipl.Cargo~idCargo}
   * @param {boolean} [eleicoesParaRenovar=1] - {@link ipl.Cargo~eleicoesParaRenovar}
   */
  function Cargo(repo, idCargo, eleicoesParaRenovar) {
    /**
     * Fonte de dados eleitorais.
     * @member {ipl.RepositorioEleitoral} ipl.Cargo~repo
     */
    this.repo = repo;
    /**
     * Identificação do cargo.
     * @member {ipl.IdCargo} ipl.Cargo~idCargo
     */
    this.idCargo = idCargo;
    /**
     * Número de eleições necesárias para renovar todos os eleitos pelo cargo.
     * @member {number} ipl.Cargo~eleicoesParaRenovar
     */
    this.eleicoesParaRenovar = eleicoesParaRenovar || 1;
  }

  Cargo.prototype = {

    /**
     * Retorna todos os anos de eleição para o cargo.
     *
     * @param {ipl.Ue} ue
     * @returns {Array<ipl.Ano>}
     * @nosideeffects
     */
    eleicoes: function(ue) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var anos = this.repo.anosDeEleicao(tipoDeEleicao);
      return anos.slice(this.eleicoesParaRenovar - 1);
    },

    /**
     * Retorna todos os partidos que tem representantes no ano.
     *
     * @param {ipl.Ue} ue
     * @param {ipl.Ano} ano
     * @returns {Array<ipl.IdPartido>}
     * @nosideeffects
     */
    partidos: function(ue, ano) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      var partidosPorMandato = _.map(mandatos, function(anoDaEleicao) {
        return this.repo.partidosComRepresentantes(tipoDeEleicao, anoDaEleicao);
      }, this);
      return _.union.apply(_, partidosPorMandato);
    },

    /**
     * Retorna se tem representante no ano.
     *
     * @param {ipl.Ue} ue
     * @param {ipl.Ano} ano
     * @returns {boolean}
     * @nosideeffects
     */
    temDados: function(ue, ano) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatosAtivos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return mandatosAtivos.length === this.eleicoesParaRenovar;
    },

    /**
     * Retorna representantes pelo partido no ano.
     *
     * @param {ipl.Ue} ue
     * @param {ipl.Ano} ano
     * @param {ipl.IdPartido} serie
     * @returns {number}
     * @nosideeffects
     */
    quantidade: function(ue, ano, partido) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.quantidade(tipoDeEleicao, eleicao, partido);
      }, this);
    },

    /**
     * Retorna total de representantes no ano.
     *
     * @param {ipl.Ue} ue
     * @param {ipl.Ano} ano
     * @returns {number}
     * @nosideeffects
     */
    total: function(ue, ano) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.total(tipoDeEleicao, eleicao);
      }, this);
    }

  };

  /**
   * @classdesc Resultados com valores proporcionais à população da UE representada.
   *
   * @alias ipl.CargoPorPopulacao
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo   - {@link ipl.Cargo~repo}
   * @param {ipl.IdCargo} idCargo             - {@link ipl.Cargo~idCargo}
   * @param {boolean} [eleicoesParaRenovar=1] - {@link ipl.Cargo~eleicoesParaRenovar}
   * @extends {ipl.Cargo}
   */
  function CargoPorPopulacao() { Cargo.apply(this, arguments); }

  CargoPorPopulacao.prototype = Object.create(Cargo.prototype, {
    constructor: { value: CargoPorPopulacao },

    /**
     * @member CargoPorPopulacao#quantidade
     * @inheritdoc
     */
    quantidade: { value: function(ue, ano, partido) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var populacaoDoAno = this.repo.populacao(ue, ano);
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
          var populacaoDoAnoDaEleicao = this.repo.populacao(ue, eleicao);
          return preCalculado * (populacaoDoAno / populacaoDoAnoDaEleicao);
        }
        var quantidade = this.repo.quantidade(tipoDeEleicao, eleicao, partido);
        return (quantidade / total) * populacaoDoAno;
      }, this);
    } },

    /**
     * @member CargoPorPopulacao#total
     * @inheritdoc
     */
    total: { value: function(ue, ano) {
      return this.repo.populacao(ue, ano);
    } }

  });

  /**
   * @classdesc Índice para um único cargo.
   *
   * @alias ipl.IndicePorCargo
   * @constructor
   * @param {ipl.Cargo} cargo   - {@link ipl.IndicePorCargo~cargo}
   * @param {ipl.Esfera} esfera - {@link ipl.IndicePorCargo~esfera}
   * @implements {ipl.Indice}
   */
  function IndicePorCargo(cargo, esfera) {
    /**
     * Cargo.
     * @member {ipl.Cargo} ipl.IndicePorCargo~cargo
     */
    this.cargo = cargo;
    /**
     * Esfera.
     * @member {ipl.Esfera} ipl.IndicePorCargo~esfera
     */
    this.esfera = esfera;
  }

  IndicePorCargo.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    eleicoes: function(regiao) {
      var ues = this.esfera.uesComDados(regiao);
      var eleicoes = _.map(ues, function(ue) {
        return this.cargo.eleicoes(ue);
      }, this);
      return _.flatten(eleicoes);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    partidos: function(regiao, ano) {
      var ues = this.esfera.uesComDados(regiao);
      var partidos = _.map(ues, function(ue) {
        return this.cargo.partidos(ue, ano);
      }, this);
      return _.flatten(partidos);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    temDados: function(regiao, ano) {
      var ues = this.esfera.uesComDados(regiao);
      return _.all(ues, function(ue) {
        return this.cargo.temDados(ue, ano);
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    calcula: function(regiao, ano, idPartido) {
      var todasUes = this.esfera.todasAsUes(regiao);
      var total = _.sum(todasUes, function(ue) {
        return this.cargo.total(ue, ano);
      }, this);
      var uesComIndice = this.esfera.uesComDados(regiao);
      var indice = _.sum(uesComIndice, function(ue) {
        var quantidade = this.cargo.quantidade(ue, ano, idPartido);
        return quantidade / total;
      }, this);
      return indice;
    }

  };

  ipl.Cargo             = Cargo;
  ipl.CargoPorPopulacao = CargoPorPopulacao;
  ipl.IndicePorCargo    = IndicePorCargo;

})(ipl, _);
