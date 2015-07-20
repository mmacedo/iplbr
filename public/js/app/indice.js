/* globals ipl */
/* exported ipl.FabricaDeIndices */

;(function(ipl) {
  'use strict';

  /**
   * Interface para um objeto que retorna os dados de um índice.
   *
   * @interface Indice
   */

  /**
   * Retornar anos que tem dados para esse índice.
   *
   * @method Indice#anos
   * @param {Regiao} regiao
   * @returns {number}
   */

  /**
   * Retornar se tem dados suficientes no ano para calcular o índice.
   *
   * @method Indice#temDados
   * @param {Regiao} regiao
   * @param {Ano}    ano
   * @returns {boolean}
   */

  /**
   * Retornar todas as séries que tem dados para esse índice.
   *
   * @method Indice#series
   * @param {Regiao} regiao
   * @param {Ano}    ano
   * @returns {number}
   */

  /**
   * Retornar índice no ano para a série.
   *
   * @method Indice#calcula
   * @param {Regiao}    regiao
   * @param {Ano}       ano
   * @param {IdPartido} idPartido
   * @returns {number}
   */

  /**
   * @classdesc
   * Classe para construção de índices.
   *
   * @constructor
   * @param {RepositorioEleitoral} repo - {@link FabricaDeIndices~repo}
   */
  function FabricaDeIndices(repo) {
    /**
     * Repositório de dados das eleições.
     *
     * @memberOf FabricaDeIndices.prototype
     * @member {RepositorioEleitoral}
     * @private
     */
    this.repo = repo;
    /**
     * Cache de singletons.
     *
     * @memberOf FabricaDeIndices.prototype
     * @member {ipl.Cache}
     * @private
     */
    this.singletons = new ipl.Cache();
  }

  /** @const {number} */
  var RENOVACAO_SENADO = 2;

  FabricaDeIndices.prototype = {

    deputadosFederais: function() {
      if (!this.singletons.has('deputadosFederais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_federal');
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosFederais', indice);
      }
      return this.singletons.get('deputadosFederais');
    },

    senadores: function() {
      if (!this.singletons.has('senadores')) {
        var cargo     = new ipl.Cargo(this.repo, 'senador', RENOVACAO_SENADO);
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('senadores', indice);
      }
      return this.singletons.get('senadores');
    },

    presidentes: function() {
      if (!this.singletons.has('presidentes')) {
        var cargo     = new ipl.Cargo(this.repo, 'presidente');
        var esfera    = new ipl.EsferaFederal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('presidentes', indice);
      }
      return this.singletons.get('presidentes');
    },

    deputadosEstaduais: function() {
      if (!this.singletons.has('deputadosEstaduais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_estadual');
        var esfera    = new ipl.EsferaEstadual();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosEstaduais', indice);
      }
      return this.singletons.get('deputadosEstaduais');
    },

    governadoresEstaduais: function() {
      if (!this.singletons.has('governadoresEstaduais')) {
        var cargo     = new ipl.Cargo(this.repo, 'governador');
        var esfera    = new ipl.EsferaEstadual();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('governadoresEstaduais', indice);
      }
      return this.singletons.get('governadoresEstaduais');
    },

    deputadosDistritais: function() {
      if (!this.singletons.has('deputadosDistritais')) {
        var cargo     = new ipl.Cargo(this.repo, 'deputado_distrital');
        var esfera    = new ipl.EsferaDistrital();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('deputadosDistritais', indice);
      }
      return this.singletons.get('deputadosDistritais');
    },

    governadoresDistritais: function() {
      if (!this.singletons.has('governadoresDistritais')) {
        var cargo     = new ipl.Cargo(this.repo, 'governador');
        var esfera    = new ipl.EsferaDistrital();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('governadoresDistritais', indice);
      }
      return this.singletons.get('governadoresDistritais');
    },

    vereadores: function() {
      if (!this.singletons.has('vereadores')) {
        var cargo     = new ipl.Cargo(this.repo, 'vereador');
        var esfera    = new ipl.EsferaMunicipal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('vereadores', indice);
      }
      return this.singletons.get('vereadores');
    },

    prefeitos: function() {
      if (!this.singletons.has('prefeitos')) {
        var cargo     = new ipl.Cargo(this.repo, 'prefeito');
        var esfera    = new ipl.EsferaMunicipal();
        var resultado = new ipl.ResultadoPorPopulacao(this.repo);
        var indice    = new ipl.IndicePorCargo(cargo, esfera, resultado);
        this.singletons.set('prefeitos', indice);
      }
      return this.singletons.get('prefeitos');
    },

    indice: function() {
      var chave = 'indice';
      if (!this.singletons.has(chave)) {
        var federal   = this.federal();
        var estadual  = this.estadual();
        var municipal = this.municipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    legislativo: function() {
      var chave = 'legislativo';
      if (!this.singletons.has(chave)) {
        var federal   = this.legislativoFederal();
        var estadual  = this.legislativoEstadual();
        var municipal = this.legislativoMunicipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    executivo: function() {
      var chave = 'executivo';
      if (!this.singletons.has(chave)) {
        var federal   = this.executivoFederal();
        var estadual  = this.executivoEstadual();
        var municipal = this.executivoMunicipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    federal: function() {
      var chave = 'federal';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoFederal();
        var executivo   = this.executivoFederal();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    legislativoFederal: function() {
      var chave = 'legislativoFederal';
      if (!this.singletons.has(chave)) {
        var menor = this.deputadosFederais();
        var maior = this.senadores();
        var indice = new ipl.IndiceBicameral(menor, maior);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    estadual: function() {
      var chave = 'estadual';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoEstadual();
        var executivo   = this.executivoEstadual();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    legislativoEstadual: function() {
      var chave = 'legislativoEstadual';
      if (!this.singletons.has(chave)) {
        var regular   = this.deputadosEstaduais();
        var distrital = this.deputadosDistritais();
        var indice = new ipl.IndiceSomaDistritoFederal(regular, distrital);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    executivoEstadual: function() {
      var chave = 'executivoEstadual';
      if (!this.singletons.has(chave)) {
        var regular   = this.governadoresEstaduais();
        var distrital = this.governadoresDistritais();
        var indice = new ipl.IndiceSomaDistritoFederal(regular, distrital);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    municipal: function() {
      var chave = 'municipal';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoMunicipal();
        var executivo   = this.executivoMunicipal();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    legislativoMunicipal: function() {
      var chave = 'legislativoMunicipal';
      if (!this.singletons.has(chave)) {
        var regular   = this.vereadores();
        var distrital = this.deputadosDistritais();
        var indice = new ipl.IndiceSomaDistritoFederal(regular, distrital);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    },

    executivoMunicipal: function() {
      var chave = 'executivoMunicipal';
      if (!this.singletons.has(chave)) {
        var regular   = this.prefeitos();
        var distrital = this.governadoresDistritais();
        var indice = new ipl.IndiceSomaDistritoFederal(regular, distrital);
        this.singletons.set(chave, indice);
        return indice;
      }
      return this.singletons.get(chave);
    }

  };

  /** @borrows FabricaDeIndices#presidentes */
  FabricaDeIndices.prototype.executivoFederal = FabricaDeIndices.prototype.presidentes;

  ipl.FabricaDeIndices = FabricaDeIndices;

})(ipl);
