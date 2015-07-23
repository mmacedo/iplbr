/* globals ipl, _ */
/* exported ipl.Cargo */
/* exported ipl.IndicePorCargo */

;(function(ipl, _) {
  'use strict';

  /**
   * @classdesc
   * Objeto com dados das eleições para um cargo.
   *
   * @alias ipl.Cargo
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo   - {@link ipl.Cargo~repo}
   * @param {IdCargo} idCargo                 - {@link ipl.Cargo~idCargo}
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
     * Retorna todos os partidos que elegeram cargo no ano.
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
     * Retorna se teve eleição para o cargo no ano.
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
    }

  };

  /**
   * @classdesc
   * Índice para um único cargo.
   *
   * @alias ipl.IndicePorCargo
   * @constructor
   * @param {ipl.Cargo} cargo     - {@link IndicePorCargo~cargo}
   * @param {Esfera} esfera       - {@link IndicePorCargo~esfera}
   * @param {Resultado} resultado - {@link IndicePorCargo~resultado}
   * @implements {ipl.Indice}
   */
  function IndicePorCargo(cargo, esfera, resultado) {
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
    /**
     * Resultados das eleições.
     * @member {ipl.Resultado} ipl.IndicePorCargo~resultado
     */
    this.resultado = resultado;
  }

  IndicePorCargo.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    anos: function(regiao) {
      var ues = this.esfera.uesComDados(regiao);
      var anos = _.map(ues, function(ue) {
        return this.cargo.eleicoes(ue);
      }, this);
      return _.flatten(anos);
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
      var somaDosPesos = _.sum(todasUes, function(ue) {
        var tipoDeEleicao = { cargo: this.cargo.idCargo, ue: ue };
        return this.resultado.peso(tipoDeEleicao, ano);
      }, this);
      var uesComIndice = this.esfera.uesComDados(regiao);
      var indice = _.sum(uesComIndice, function(ue) {
        var tipoDeEleicao = { cargo: this.cargo.idCargo, ue: ue };
        var quantidade = this.resultado.quantidade(tipoDeEleicao, ano, idPartido);
        var total      = this.resultado.total(tipoDeEleicao, ano);
        var peso       = this.resultado.peso(tipoDeEleicao, ano);
        return (quantidade / total) * (peso / somaDosPesos);
      }, this);
      return indice;
    }

  };

  ipl.Cargo          = Cargo;
  ipl.IndicePorCargo = IndicePorCargo;

})(ipl, _);
