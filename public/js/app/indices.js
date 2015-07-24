/* globals ipl */
/* exported ipl.FabricaDeIndices */

;(function(ipl) {
  'use strict';

  /**
   * Interface para um objeto que retorna os dados de um índice.
   *
   * @name ipl.Indice
   * @interface
   */
  /**
   * Retornar anos que tem dados para esse índice.
   *
   * @method ipl.Indice#anos
   * @param {ipl.Regiao} regiao
   * @returns {Array<ipl.Ano>}
   */
  /**
   * Retornar se tem dados suficientes no ano para calcular o índice.
   *
   * @method ipl.Indice#temDados
   * @param {ipl.Regiao} regiao
   * @param {ipl.Ano}    ano
   * @returns {boolean}
   */
  /**
   * Retornar todas as séries que tem dados para esse índice.
   *
   * @method ipl.Indice#partidos
   * @param {ipl.Regiao} regiao
   * @param {ipl.Ano}    ano
   * @returns {Array<ipl.IdPartido>}
   */
  /**
   * Retornar índice no ano para a série.
   *
   * @method ipl.Indice#calcula
   * @param {ipl.Regiao}    regiao
   * @param {ipl.Ano}       ano
   * @param {ipl.IdPartido} idPartido
   * @returns {number}
   */

  /**
   * @classdesc Classe para construção de índices.
   *
   * @alias ipl.FabricaDeIndices
   * @constructor
   * @param {ipl.RepositorioEleitoral} repo - {@link ipl.FabricaDeIndices~repo}
   */
  function FabricaDeIndices(repo) {
    /**
     * Repositório de dados das eleições.
     * @member {ipl.RepositorioEleitoral} ipl.FabricaDeIndices~repo
     */
    this.repo = repo;
    /**
     * Cache de singletons.
     * @member {ipl.Cache} ipl.FabricaDeIndices~cache
     */
    this.singletons = new ipl.Cache();
  }

  /** @const {number} */
  var RENOVACAO_SENADO = 2;

  FabricaDeIndices.prototype = {

    /**
     * Índice de deputados federais.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    deputadosFederais: function() {
      if (!this.singletons.has('deputadosFederais')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'deputado_federal');
        var esfera = new ipl.EsferaFederal();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('deputadosFederais', indice);
      }
      return this.singletons.get('deputadosFederais');
    },

    /**
     * Índice de senadores.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    senadores: function() {
      if (!this.singletons.has('senadores')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'senador', RENOVACAO_SENADO);
        var esfera = new ipl.EsferaFederal();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('senadores', indice);
      }
      return this.singletons.get('senadores');
    },

    /**
     * Índice de presidentes.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    presidentes: function() {
      if (!this.singletons.has('presidentes')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'presidente');
        var esfera = new ipl.EsferaFederal();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('presidentes', indice);
      }
      return this.singletons.get('presidentes');
    },

    /**
     * Índice de deputados estaduais proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    deputadosEstaduais: function() {
      if (!this.singletons.has('deputadosEstaduais')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'deputado_estadual');
        var esfera = new ipl.EsferaEstadual();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('deputadosEstaduais', indice);
      }
      return this.singletons.get('deputadosEstaduais');
    },

    /**
     * Índice de governadores (estaduais) proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    governadoresEstaduais: function() {
      if (!this.singletons.has('governadoresEstaduais')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'governador');
        var esfera = new ipl.EsferaEstadual();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('governadoresEstaduais', indice);
      }
      return this.singletons.get('governadoresEstaduais');
    },

    /**
     * Índice de deputados distritais proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    deputadosDistritais: function() {
      if (!this.singletons.has('deputadosDistritais')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'deputado_distrital');
        var esfera = new ipl.EsferaDistrital();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('deputadosDistritais', indice);
      }
      return this.singletons.get('deputadosDistritais');
    },

    /**
     * Índice de governadores (distritais) proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    governadoresDistritais: function() {
      if (!this.singletons.has('governadoresDistritais')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'governador');
        var esfera = new ipl.EsferaDistrital();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('governadoresDistritais', indice);
      }
      return this.singletons.get('governadoresDistritais');
    },

    /**
     * Índice de vereadores proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    vereadores: function() {
      if (!this.singletons.has('vereadores')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'vereador');
        var esfera = new ipl.EsferaMunicipal();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('vereadores', indice);
      }
      return this.singletons.get('vereadores');
    },

    /**
     * Índice de prefeitos proporcional à população das UFs.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    prefeitos: function() {
      if (!this.singletons.has('prefeitos')) {
        var cargo  = new ipl.CargoPorPopulacao(this.repo, 'prefeito');
        var esfera = new ipl.EsferaMunicipal();
        var indice = new ipl.IndicePorCargo(cargo, esfera);
        this.singletons.set('prefeitos', indice);
      }
      return this.singletons.get('prefeitos');
    },

    /**
     * Índice de todas as esferas proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    indice: function() {
      var chave = 'indice';
      if (!this.singletons.has(chave)) {
        var federal   = this.federal();
        var estadual  = this.estadual();
        var municipal = this.municipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice de todas as esferas (só legislativo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    legislativo: function() {
      var chave = 'legislativo';
      if (!this.singletons.has(chave)) {
        var federal   = this.legislativoFederal();
        var estadual  = this.legislativoEstadual();
        var municipal = this.legislativoMunicipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice de todas as esferas (só executivo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    executivo: function() {
      var chave = 'executivo';
      if (!this.singletons.has(chave)) {
        var federal   = this.executivoFederal();
        var estadual  = this.executivoEstadual();
        var municipal = this.executivoMunicipal();
        var indice = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera federal proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    federal: function() {
      var chave = 'federal';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoFederal();
        var executivo   = this.executivoFederal();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera federal (só legislativo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    legislativoFederal: function() {
      var chave = 'legislativoFederal';
      if (!this.singletons.has(chave)) {
        var menor = this.deputadosFederais();
        var maior = this.senadores();
        var indice = new ipl.IndiceBicameral(menor, maior);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera estadual proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    estadual: function() {
      var chave = 'estadual';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoEstadual();
        var executivo   = this.executivoEstadual();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera estadual (só legislativo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    legislativoEstadual: function() {
      var chave = 'legislativoEstadual';
      if (!this.singletons.has(chave)) {
        var regular   = this.deputadosEstaduais();
        var distrital = this.deputadosDistritais();
        var indice = new ipl.IndiceSomaDf(regular, distrital);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera estadual (só executivo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    executivoEstadual: function() {
      var chave = 'executivoEstadual';
      if (!this.singletons.has(chave)) {
        var regular   = this.governadoresEstaduais();
        var distrital = this.governadoresDistritais();
        var indice = new ipl.IndiceSomaDf(regular, distrital);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera municipal proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    municipal: function() {
      var chave = 'municipal';
      if (!this.singletons.has(chave)) {
        var legislativo = this.legislativoMunicipal();
        var executivo   = this.executivoMunicipal();
        var indice = new ipl.IndiceEsfera(legislativo, executivo);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera municipal (só legislativo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    legislativoMunicipal: function() {
      var chave = 'legislativoMunicipal';
      if (!this.singletons.has(chave)) {
        var regular   = this.vereadores();
        var distrital = this.deputadosDistritais();
        var indice = new ipl.IndiceSomaDf(regular, distrital);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    },

    /**
     * Índice da esfera municipal (só executivo) proporcional à população.
     *
     * @returns {ipl.Indice}
     * @nosideeffects
     */
    executivoMunicipal: function() {
      var chave = 'executivoMunicipal';
      if (!this.singletons.has(chave)) {
        var regular   = this.prefeitos();
        var distrital = this.governadoresDistritais();
        var indice = new ipl.IndiceSomaDf(regular, distrital);
        this.singletons.set(chave, indice);
      }
      return this.singletons.get(chave);
    }

  };

  /** @borrows FabricaDeIndices#presidentes */
  FabricaDeIndices.prototype.executivoFederal = FabricaDeIndices.prototype.presidentes;

  ipl.FabricaDeIndices = FabricaDeIndices;

})(ipl);
