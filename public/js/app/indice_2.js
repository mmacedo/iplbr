/* globals _, Indice, RepositorioDeIndices */

(function(_, Indice, RepositorioDeIndices) {
  'use strict';

  function herdar(filha, mae, metodos) {
    filha.prototype = _.create(mae.prototype, _.assign({ constructor: filha }, metodos));
  }

  function IndiceBicameral(menor, maior) {
    this.menor = menor;
    this.maior = maior;
  }

  herdar(IndiceBicameral, Indice, {

    anosComDados: function(ufs) {
      return _.union(
        this.menor.anosComDados(ufs),
        this.maior.anosComDados(ufs)
      ).sort();
    },

    temDados: function(ufs, ano) {
      return this.menor.temDados(ufs, ano) && this.maior.temDados(ufs, ano);
    },

    siglasComDados: function(ufs, ano) {
      return _.union(
        this.menor.siglasComDados(ufs, ano),
        this.maior.siglasComDados(ufs, ano)
      ).sort();
    },

    calcula: function(ufs, ano, sigla) {
      var menor = this.menor.calcula(ufs, ano, sigla);
      var maior = this.maior.calcula(ufs, ano, sigla);
      return (menor + maior) / 2;
    },

  });

  function IndiceSomaDistrital(regular, distrital) {
    this.regular   = regular;
    this.distrital = distrital;
  }

  herdar(IndiceSomaDistrital, Indice, {

    anosComDados: function(ufs) {
      return _.union(
        this.regular.anosComDados(ufs),
        this.distrital.anosComDados(ufs)
      ).sort();
    },

    temDados: function(ufs, ano) {
      return this.regular.temDados(ufs, ano) && this.distrital.temDados(ufs, ano);
    },

    siglasComDados: function(ufs, ano) {
      return _.union(
        this.regular.siglasComDados(ufs, ano),
        this.distrital.siglasComDados(ufs, ano)
      ).sort();
    },

    calcula: function(ufs, ano, sigla) {
      var regular   = this.regular.calcula(ufs, ano, sigla);
      var distrital = this.distrital.calcula(ufs, ano, sigla);
      return regular + distrital;
    },

  });

  function IndiceEsfera(legislativo, executivo) {
    this.legislativo = legislativo;
    this.executivo   = executivo;
  }

  herdar(IndiceEsfera, Indice, {

    anosComDados: function(ufs) {
      return _.union(
        this.legislativo.anosComDados(ufs),
        this.executivo.anosComDados(ufs)
      ).sort();
    },

    temDados: function(ufs, ano) {
      return this.legislativo.temDados(ufs, ano) && this.executivo.temDados(ufs, ano);
    },

    siglasComDados: function(ufs, ano) {
      return _.union(
        this.legislativo.siglasComDados(ufs, ano),
        this.executivo.siglasComDados(ufs, ano)
      ).sort();
    },

    calcula: function(ufs, ano, sigla) {
      var legislativo = this.legislativo.calcula(ufs, ano, sigla);
      var executivo   = this.executivo.calcula(ufs, ano, sigla);
      return legislativo * 0.75 + executivo * 0.25;
    },

  });

  function IndiceTotal(federal, estadual, municipal) {
    this.federal   = federal;
    this.estadual  = estadual;
    this.municipal = municipal;
  }

  herdar(IndiceTotal, Indice, {

    anosComDados: function(ufs) {
      return _.union(
        this.federal.anosComDados(ufs),
        this.estadual.anosComDados(ufs),
        this.municipal.anosComDados(ufs)
      ).sort();
    },

    temDados: function(ufs, ano) {
      return this.federal.temDados(ufs, ano) &&
        this.estadual.temDados(ufs, ano) &&
        this.municipal.temDados(ufs, ano);
    },

    siglasComDados: function(ufs, ano) {
      return _.union(
        this.federal.siglasComDados(ufs, ano),
        this.estadual.siglasComDados(ufs, ano),
        this.municipal.siglasComDados(ufs, ano)
      ).sort();
    },

    calcula: function(ufs, ano, sigla) {
      var federal   = this.federal.calcula(ufs, ano, sigla);
      var estadual  = this.estadual.calcula(ufs, ano, sigla);
      var municipal = this.municipal.calcula(ufs, ano, sigla);
      return (federal + estadual + municipal) / 3;
    },

  });

  _.extend(RepositorioDeIndices.prototype, {

    indice: _.memoize(function() {
      var federal   = this.federal();
      var estadual  = this.estadual();
      var municipal = this.municipal();
      return new IndiceTotal(federal, estadual, municipal);
    }),

    legislativo: _.memoize(function() {
      var federal   = this.legislativoFederal();
      var estadual  = this.legislativoEstadual();
      var municipal = this.legislativoMunicipal();
      return new IndiceTotal(federal, estadual, municipal);
    }),

    executivo: _.memoize(function() {
      var federal   = this.executivoFederal();
      var estadual  = this.executivoEstadual();
      var municipal = this.executivoMunicipal();
      return new IndiceTotal(federal, estadual, municipal);
    }),

    federal: _.memoize(function() {
      var legislativo = this.legislativoFederal();
      var executivo   = this.executivoFederal();
      return new IndiceEsfera(legislativo, executivo);
    }),

    legislativoFederal: _.memoize(function() {
      var menor = this.deputadosFederais();
      var maior = this.senadores();
      return new IndiceBicameral(menor, maior);
    }),

    // funciona como sinônimo para #presidentes
    executivoFederal: RepositorioDeIndices.prototype.presidentes,

    estadual: _.memoize(function() {
      var legislativo = this.legislativoEstadual();
      var executivo   = this.executivoEstadual();
      return new IndiceEsfera(legislativo, executivo);
    }),

    legislativoEstadual: _.memoize(function() {
      var regular   = this.deputadosEstaduais('populacao');
      var distrital = this.deputadosDistritais('populacao');
      return new IndiceSomaDistrital(regular, distrital);
    }),

    executivoEstadual: _.memoize(function() {
      var regular   = this.governadoresEstaduais('populacao');
      var distrital = this.governadoresDistritais('populacao');
      return new IndiceSomaDistrital(regular, distrital);
    }),

    municipal: _.memoize(function() {
      var legislativo = this.legislativoMunicipal();
      var executivo   = this.executivoMunicipal();
      return new IndiceEsfera(legislativo, executivo);
    }),

    legislativoMunicipal: _.memoize(function() {
      var regular   = this.vereadores('populacao');
      var distrital = this.deputadosDistritais('populacao');
      return new IndiceSomaDistrital(regular, distrital);
    }),

    executivoMunicipal: _.memoize(function() {
      var regular   = this.prefeitos('populacao');
      var distrital = this.governadoresDistritais('populacao');
      return new IndiceSomaDistrital(regular, distrital);
    }),

  });

}.call(this, _, Indice, RepositorioDeIndices));
