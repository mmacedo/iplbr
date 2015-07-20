/* globals ipl, _ */
/* exported ipl.IndiceBicameral */
/* exported ipl.IndiceSomaDistritoFederal */
/* exported ipl.IndiceEsfera */
/* exported ipl.IndiceTodosOsNiveis */

;(function(ipl, _) {
  'use strict';

  /**
   * @classdesc
   * Índice para um legislativo com duas casas de igual poder.
   *
   * @constructor
   * @param {Indice} menor - {@link IndiceBicameral~menor}
   * @param {Indice} maior - {@link IndiceBicameral~maior}
   * @implements {Indice}
   */
  function IndiceBicameral(menor, maior) {
    this.menor = menor;
    this.maior = maior;
  }

  IndiceBicameral.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    anos: function(regiao) {
      return _.flatten([
        this.menor.anos(regiao),
        this.maior.anos(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    series: function(regiao, ano) {
      return _.flatten([
        this.menor.series(regiao, ano),
        this.maior.series(regiao, ano)
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
   * @classdesc
   * Índice para uma esfera somando os valores do Distrito Federal.
   *
   * @constructor
   * @param {Indice} regular   - {@link IndiceSomaDistritoFederal~regular}
   * @param {Indice} distrital - {@link IndiceSomaDistritoFederal~distrital}
   * @implements {Indice}
   */
  function IndiceSomaDistritoFederal(regular, distrital) {
    this.regular   = regular;
    this.distrital = distrital;
  }

  IndiceSomaDistritoFederal.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    anos: function(regiao) {
      return _.flatten([
        this.regular.anos(regiao),
        this.distrital.anos(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    series: function(regiao, ano) {
      return _.flatten([
        this.regular.series(regiao, ano),
        this.distrital.series(regiao, ano)
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
   * @classdesc
   * Índice para todos os poderes de uma esfera.
   *
   * @constructor
   * @param {Indice} legislativo - {@link IndiceEsfera~legislativo}
   * @param {Indice} executivo   - {@link IndiceEsfera~executivo}
   * @implements {Indice}
   */
  function IndiceEsfera(legislativo, executivo) {
    this.legislativo = legislativo;
    this.executivo   = executivo;
  }

  IndiceEsfera.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    anos: function(regiao) {
      return _.flatten([
        this.legislativo.anos(regiao),
        this.executivo.anos(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    series: function(regiao, ano) {
      return _.flatten([
        this.legislativo.series(regiao, ano),
        this.executivo.series(regiao, ano)
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
   * @classdesc
   * Índice para a média de todos os níveis
   *
   * @constructor
   * @param {Indice} federal   - {@link IndiceTodosOsNiveis~federal}
   * @param {Indice} estadual  - {@link IndiceTodosOsNiveis~estadual}
   * @param {Indice} municipal - {@link IndiceTodosOsNiveis~municipal}
   * @implements {Indice}
   */
  function IndiceTodosOsNiveis(federal, estadual, municipal) {
    this.federal   = federal;
    this.estadual  = estadual;
    this.municipal = municipal;
  }

  IndiceTodosOsNiveis.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    anos: function(regiao) {
      return _.flatten([
        this.federal.anos(regiao),
        this.estadual.anos(regiao),
        this.municipal.anos(regiao)
      ]);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    series: function(regiao, ano) {
      return _.flatten([
        this.federal.series(regiao, ano),
        this.estadual.series(regiao, ano),
        this.municipal.series(regiao, ano)
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
  ipl.IndiceSomaDistritoFederal = IndiceSomaDistritoFederal;
  ipl.IndiceEsfera              = IndiceEsfera;
  ipl.IndiceTodosOsNiveis       = IndiceTodosOsNiveis;

})(ipl, _);
