/* globals ipl, _ */
/* exported ipl.IndiceBicameral */
/* exported ipl.IndiceSomaDf */
/* exported ipl.IndiceEsfera */
/* exported ipl.IndiceTodosOsNiveis */

;(function(ipl, _) {
  'use strict';

  /**
   * @classdesc Índice para um legislativo com duas casas de igual poder.
   *
   * @alias ipl.IndiceBicameral
   * @constructor
   * @param {ipl.Indice} menor - {@link ipl.IndiceBicameral~menor}
   * @param {ipl.Indice} maior - {@link ipl.IndiceBicameral~maior}
   * @implements {ipl.Indice}
   */
  function IndiceBicameral(menor, maior) {
    /**
     * Índice da casa menor.
     * @member {ipl.Indice} ipl.IndiceBicameral~menor
     */
    this.menor = menor;
    /**
     * Índice da casa maior.
     * @member {ipl.Indice} ipl.IndiceBicameral~maior
     */
    this.maior = maior;
  }

  IndiceBicameral.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    eleicoes: function(regiao) {
      return _.flatten([
        this.menor.eleicoes(regiao),
        this.maior.eleicoes(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    partidos: function(regiao, ano) {
      return _.flatten([
        this.menor.partidos(regiao, ano),
        this.maior.partidos(regiao, ano)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    temDados: function(regiao, ano) {
      return this.menor.temDados(regiao, ano) &&
        this.maior.temDados(regiao, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    calcula: function(regiao, ano, idPartido) {
      var menor = this.menor.calcula(regiao, ano, idPartido);
      var maior = this.maior.calcula(regiao, ano, idPartido);
      return (menor + maior) / 2;
    }

  };

  /**
   * @classdesc Índice para uma esfera somando os valores do Distrito Federal.
   *
   * @alias ipl.IndiceSomaDf
   * @constructor
   * @param {ipl.Indice} regular   - {@link ipl.IndiceSomaDf~regular}
   * @param {ipl.Indice} distrital - {@link ipl.IndiceSomaDf~distrital}
   * @implements {ipl.Indice}
   */
  function IndiceSomaDf(regular, distrital) {
    /**
     * Índice das UF's (apenas estados).
     * @member {ipl.Indice} ipl.IndiceSomaDf~regular
     */
    this.regular = regular;
    /**
     * Índice das UF's (apenas DF).
     * @member {ipl.Indice} ipl.IndiceSomaDf~distrital
     */
    this.distrital = distrital;
  }

  IndiceSomaDf.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    eleicoes: function(regiao) {
      return _.flatten([
        this.regular.eleicoes(regiao),
        this.distrital.eleicoes(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    partidos: function(regiao, ano) {
      return _.flatten([
        this.regular.partidos(regiao, ano),
        this.distrital.partidos(regiao, ano)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    temDados: function(regiao, ano) {
      return this.regular.temDados(regiao, ano) &&
        this.distrital.temDados(regiao, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    calcula: function(regiao, ano, idPartido) {
      var regular   = this.regular.calcula(regiao, ano, idPartido);
      var distrital = this.distrital.calcula(regiao, ano, idPartido);
      return regular + distrital;
    }

  };

  /**
   * @classdesc Índice para todos os poderes de uma esfera.
   *
   * @alias ipl.IndiceEsfera
   * @constructor
   * @param {ipl.Indice} legislativo - {@link ipl.IndiceEsfera~legislativo}
   * @param {ipl.Indice} executivo   - {@link ipl.IndiceEsfera~executivo}
   * @implements {ipl.Indice}
   */
  function IndiceEsfera(legislativo, executivo) {
    /**
     * Índice dos cargos do legislativo.
     * @member {ipl.Indice} ipl.IndiceEsfera~legislativo
     */
    this.legislativo = legislativo;
    /**
     * Índice dos cargos do executivo.
     * @member {ipl.Indice} ipl.IndiceEsfera~executivo
     */
    this.executivo = executivo;
  }

  IndiceEsfera.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    eleicoes: function(regiao) {
      return _.flatten([
        this.legislativo.eleicoes(regiao),
        this.executivo.eleicoes(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    partidos: function(regiao, ano) {
      return _.flatten([
        this.legislativo.partidos(regiao, ano),
        this.executivo.partidos(regiao, ano)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    temDados: function(regiao, ano) {
      return this.legislativo.temDados(regiao, ano) &&
        this.executivo.temDados(regiao, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    calcula: function(regiao, ano, idPartido) {
      var legislativo = this.legislativo.calcula(regiao, ano, idPartido);
      var executivo   = this.executivo.calcula(regiao, ano, idPartido);
      return legislativo * 0.75 + executivo * 0.25;
    }

  };

  /**
   * @classdesc Índice para a média de todos os níveis
   *
   * @alias ipl.IndiceTodosOsNiveis
   * @constructor
   * @param {ipl.Indice} federal   - {@link ipl.IndiceTodosOsNiveis~federal}
   * @param {ipl.Indice} estadual  - {@link ipl.IndiceTodosOsNiveis~estadual}
   * @param {ipl.Indice} municipal - {@link ipl.IndiceTodosOsNiveis~municipal}
   * @implements {ipl.Indice}
   */
  function IndiceTodosOsNiveis(federal, estadual, municipal) {
    /**
     * Índice dos cargos da esfera federal.
     * @member {ipl.Indice} ipl.IndiceTodosOsNiveis~federal
     */
    this.federal = federal;
    /**
     * Índice dos cargos da esfera estadual.
     * @member {ipl.Indice} ipl.IndiceTodosOsNiveis~estadual
     */
    this.estadual = estadual;
    /**
     * Índice dos cargos da esfera municipal.
     * @member {ipl.Indice} ipl.IndiceTodosOsNiveis~municipal
     */
    this.municipal = municipal;
  }

  IndiceTodosOsNiveis.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    eleicoes: function(regiao) {
      return _.flatten([
        this.federal.eleicoes(regiao),
        this.estadual.eleicoes(regiao),
        this.municipal.eleicoes(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    partidos: function(regiao, ano) {
      return _.flatten([
        this.federal.partidos(regiao, ano),
        this.estadual.partidos(regiao, ano),
        this.municipal.partidos(regiao, ano)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    temDados: function(regiao, ano) {
      return this.federal.temDados(regiao, ano) &&
        this.estadual.temDados(regiao, ano) &&
        this.municipal.temDados(regiao, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    calcula: function(regiao, ano, idPartido) {
      var federal   = this.federal.calcula(regiao, ano, idPartido);
      var estadual  = this.estadual.calcula(regiao, ano, idPartido);
      var municipal = this.municipal.calcula(regiao, ano, idPartido);
      return (federal + estadual + municipal) / 3;
    }

  };

  ipl.IndiceBicameral           = IndiceBicameral;
  ipl.IndiceSomaDf = IndiceSomaDf;
  ipl.IndiceEsfera              = IndiceEsfera;
  ipl.IndiceTodosOsNiveis       = IndiceTodosOsNiveis;

})(ipl, _);
