(function(_, ipl) {
  'use strict';

  /**
   * @classdesc
   * Índice para um único cargo.
   *
   * @constructor
   * @param {Cargo} cargo         - {@link IndicePorCargo~cargo}
   * @param {Esfera} esfera       - {@link IndicePorCargo~esfera}
   * @param {Resultado} resultado - {@link IndicePorCargo~resultado}
   * @implements {Indice}
   */
  function IndicePorCargo(cargo, esfera, resultado) {
    this.cargo     = cargo;
    this.esfera    = esfera;
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
    series: function(regiao, ano) {
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
      var todasUes = this.esfera.todasAsUesNaMesmaEsfera(regiao);
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

  /** @const {number} */
  var RENOVACAO_SENADO = 2;

  _.extend(ipl.FabricaDeIndices.prototype, /** @lends ipl.FabricaDeIndices.prototype */ {

    deputadosFederais: function() {
      if (!this.singletons.has('deputadosFederais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_federal');
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosFederais', indice);
      }
      return this.singletons.get('deputadosFederais');
    },

    senadores: function() {
      if (!this.singletons.has('senadores')) {
        var cargo     = new ipl.Cargo(this.repo, 'senador', RENOVACAO_SENADO);
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('senadores', indice);
      }
      return this.singletons.get('senadores');
    },

    presidentes: function() {
      if (!this.singletons.has('presidentes')) {
        var cargo     = new ipl.Cargo(this.repo, 'presidente');
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('presidentes', indice);
      }
      return this.singletons.get('presidentes');
    },

    deputadosEstaduais: function() {
      if (!this.singletons.has('deputadosEstaduais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_estadual');
        var esfera    = new ipl.EsferaEstadual();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosEstaduais', indice);
      }
      return this.singletons.get('deputadosEstaduais');
    },

    governadoresEstaduais: function() {
      if (!this.singletons.has('governadoresEstaduais')) {
        var cargo     = new ipl.Cargo(this.repo, 'governador');
        var esfera    = new ipl.EsferaEstadual();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('governadoresEstaduais', indice);
      }
      return this.singletons.get('governadoresEstaduais');
    },

    deputadosDistritais: function() {
      if (!this.singletons.has('deputadosDistritais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_distrital');
        var esfera    = new ipl.EsferaDistrital();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosDistritais', indice);
      }
      return this.singletons.get('deputadosDistritais');
    },

    governadoresDistritais: function() {
      if (!this.singletons.has('governadoresDistritais')) {
        var cargo     = new ipl.Cargo(this.repo, 'governador');
        var esfera    = new ipl.EsferaDistrital();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('governadoresDistritais', indice);
      }
      return this.singletons.get('governadoresDistritais');
    },

    vereadores: function() {
      if (!this.singletons.has('vereadores')) {
        var cargo     = new ipl.Cargo(this.repo, 'vereador');
        var esfera    = new ipl.EsferaMunicipal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('vereadores', indice);
      }
      return this.singletons.get('vereadores');
    },

    prefeitos: function() {
      if (!this.singletons.has('prefeitos')) {
        var cargo     = new ipl.Cargo(this.repo, 'prefeito');
        var esfera    = new ipl.EsferaMunicipal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('prefeitos', indice);
      }
      return this.singletons.get('prefeitos');
    }

  });

  _.extend(ipl, /* @lends ipl */ {
    IndicePorCargo: IndicePorCargo
  });

}.call(this, _, ipl));
