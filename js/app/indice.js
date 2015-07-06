/* global _ */
/* exported GeradorDeIndices */

(function(_) {
  'use strict';

  function herdar(filha, mae, metodos) {
    filha.prototype = _.create(mae.prototype, _.assign({ constructor: filha }, metodos));
  }

  function Cargo(repo, cargo) {
    this.repo  = repo;
    this.cargo = cargo;
  }

  _.extend(Cargo.prototype, {

    todasAsUfs: function(ufs) {
      return ufs.ufs;
    },

    ufsQueTemEleicoes: function(ufs) {
      return this.todasAsUfs(ufs.ufs);
    },

    anosDeEleicao: function(uf) {
      return this.repo.anosDeEleicao(this.cargo, uf);
    },

    temDados: function(uf, ano) {
      return this.repo.mandatosAtivos(this.cargo, uf, ano).length > 0;
    },

    siglasComRepresentantes: function(uf, ano) {
      var mandatos = this.repo.mandatosAtivos(this.cargo, uf, ano);
      return _.union.apply(_, _.map(mandatos, function(inicio) {
        return this.repo.siglasComRepresentantes(this.cargo, uf, inicio);
      }, this));
    },

    quantidade: function(uf, ano, sigla) {
      return _.sum(this.repo.mandatosAtivos(this.cargo, uf, ano), function(inicio) {
        return this.repo.quantidade(this.cargo, uf, inicio, sigla);
      }, this);
    },

    total: function(uf, ano) {
      return _.sum(this.repo.mandatosAtivos(this.cargo, uf, ano), function(inicio) {
        return this.repo.total(this.cargo, uf, inicio);
      }, this);
    },

    peso: function(uf, ano) {
      return this.total(uf, ano);
    },

  });

  function CargoFederal() { Cargo.apply(this, arguments); }

  herdar(CargoFederal, Cargo, {

    // Ignora as UFs, só é necessário um valor para qualquer UF ou município
    todasAsUfs: function() {
      return [ 'BR' ];
    },

    // Só itera sobre 'BR', assim o peso fica 1/1
    peso: function() {
      return 1;
    },

  });

  function CargoFederalRenovaMetade() { CargoFederal.apply(this, arguments); }

  herdar(CargoFederalRenovaMetade, CargoFederal, {

    anosDeEleicao: function(uf) {
      // Joga fora a primeira eleição porque precisa de duas para preencher a casa
      return this.repo.anosDeEleicao(this.cargo, uf).slice(1);
    },

    temDados: function(uf, ano) {
      // Apenas 1 eleição é só meio senado
      return this.repo.mandatosAtivos(this.cargo, uf, ano).length > 1;
    },

  });

  function CargoEstadual() { Cargo.apply(this, arguments); }

  herdar(CargoEstadual, Cargo, {

    ufsQueTemEleicoes: function(ufs) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(ufs.ufs, 'DF');
    },

  });

  function CargoEstadualPopulacao() { CargoEstadual.apply(this, arguments); }

  herdar(CargoEstadualPopulacao, CargoEstadual, {

    peso: function(uf, ano) {
      return this.repo.populacao(uf, ano);
    },

  });

  function CargoDistrital() { Cargo.apply(this, arguments); }

  herdar(CargoDistrital, Cargo, {

    ufsQueTemEleicoes: function(ufs) {
      // Calcula só o DF para somar com os estaduais e municipais
      return _.contains(ufs.ufs, 'DF') ? [ 'DF' ] : [];
    },

  });

  function CargoDistritalPopulacao() { CargoDistrital.apply(this, arguments); }

  herdar(CargoDistritalPopulacao, CargoDistrital, {

    peso: function(uf, ano) {
      return this.repo.populacao(uf, ano);
    },

  });

  function CargoMunicipal() { Cargo.apply(this, arguments); }

  herdar(CargoMunicipal, Cargo, {

    ufsQueTemEleicoes: function(ufs) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(ufs.ufs, 'DF');
    },

  });

  function CargoMunicipalPopulacao() { CargoMunicipal.apply(this, arguments); }

  herdar(CargoMunicipalPopulacao, CargoMunicipal, {

    quantidade: function(uf, ano, sigla) {
      return _.sum(this.repo.mandatosAtivos(this.cargo, uf, ano), function(inicio) {
        return this.repo.proporcionalAPopulacao(this.cargo, uf, inicio, sigla);
      }, this);
    },

    total: function(uf, ano) {
      return _.sum(this.repo.mandatosAtivos(this.cargo, uf, ano), function(inicio) {
        return this.repo.populacao(uf, inicio);
      }, this);
    },

    peso: function(uf, ano) {
      return this.repo.populacao(uf, ano);
    },

  });

  function Indice() {}

  _.extend(Indice.prototype, {
    anosComDados: function() {},
    temDados: function() {},
    siglasComDados: function() {},
    calcula: function() {},
  });

  function IndiceCargo(cargo) {
    this.cargo = cargo;
  }

  herdar(IndiceCargo, Indice, {

    anosComDados: _.memoize(function(ufs) {
      return _.union.apply(_, _.map(this.cargo.ufsQueTemEleicoes(ufs), function(uf) {
        return this.cargo.anosDeEleicao(uf);
      }, this)).sort();
    }, function(ufs) {
      return this.cargo.constructor.name + this.cargo.cargo + ufs.regiao;
    }),

    temDados: _.memoize(function(ufs, ano) {
      return _.all(this.cargo.ufsQueTemEleicoes(ufs), function(uf) {
        return this.cargo.temDados(uf, ano);
      }, this);
    }, function(ufs, ano) {
      return this.cargo.constructor.name + this.cargo.cargo + ufs.regiao + ano;
    }),

    siglasComDados: _.memoize(function(ufs, ano) {
      return _.union.apply(_, _.map(this.cargo.ufsQueTemEleicoes(ufs), function(uf) {
        return this.cargo.siglasComRepresentantes(uf, ano);
      }, this)).sort();
    }, function(ufs, ano) {
      return this.cargo.constructor.name + this.cargo.cargo + ufs.regiao + ano;
    }),

    calcula: _.memoize(function(ufs, ano, sigla) {
      var pesoTotal = _.sum(this.cargo.todasAsUfs(ufs), function(uf) {
        return this.cargo.peso(uf, ano);
      }, this);
      var indice = _.sum(this.cargo.ufsQueTemEleicoes(ufs), function(uf) {
        var quantidade = this.cargo.quantidade(uf, ano, sigla);
        var total      = this.cargo.total(uf, ano);
        var peso       = this.cargo.peso(uf, ano);
        return (quantidade / total) * (peso / pesoTotal);
      }, this);
      return indice;
    }, function(ufs, ano, sigla) {
      return this.cargo.constructor.name + this.cargo.cargo + ufs.regiao + ano + sigla;
    }),

  });

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

  function GeradorDeIndices(repositorioEleitoral) {
    this.repo = repositorioEleitoral;
  }

  _.extend(GeradorDeIndices.prototype, {

    deputadosFederais: _.memoize(function() {
      return new IndiceCargo(new CargoFederal(this.repo, 'deputado_federal'));
    }),

    senadores: _.memoize(function() {
      return new IndiceCargo(new CargoFederalRenovaMetade(this.repo, 'senador'));
    }),

    indice: function() {
      var federal   = this.federal();
      var estadual  = this.estadual();
      var municipal = this.municipal();
      return new IndiceTotal(federal, estadual, municipal);
    },

    legislativo: function() {
      var federal   = this.legislativoFederal();
      var estadual  = this.legislativoEstadual();
      var municipal = this.legislativoMunicipal();
      return new IndiceTotal(federal, estadual, municipal);
    },

    executivo: function() {
      var federal   = this.executivoFederal();
      var estadual  = this.executivoEstadual();
      var municipal = this.executivoMunicipal();
      return new IndiceTotal(federal, estadual, municipal);
    },

    federal: function() {
      var legislativo = this.legislativoFederal();
      var executivo   = this.executivoFederal();
      return new IndiceEsfera(legislativo, executivo);
    },

    legislativoFederal: function() {
      var menor = this.deputadosFederais();
      var maior = this.senadores();
      return new IndiceBicameral(menor, maior);
    },

    executivoFederal: function() {
      return new IndiceCargo(new CargoFederal(this.repo, 'presidente'));
    },

    estadual: function() {
      var legislativo = this.legislativoEstadual();
      var executivo   = this.executivoEstadual();
      return new IndiceEsfera(legislativo, executivo);
    },

    legislativoEstadual: function() {
      var regular   = new CargoEstadualPopulacao(this.repo, 'deputado_estadual');
      var distrital = new CargoDistritalPopulacao(this.repo, 'deputado_distrital');
      return new IndiceSomaDistrital(new IndiceCargo(regular), new IndiceCargo(distrital));
    },

    executivoEstadual: function() {
      var regular   = new CargoEstadualPopulacao(this.repo, 'governador');
      var distrital = new CargoDistritalPopulacao(this.repo, 'governador');
      return new IndiceSomaDistrital(new IndiceCargo(regular), new IndiceCargo(distrital));
    },

    municipal: function() {
      var legislativo = this.legislativoMunicipal();
      var executivo   = this.executivoMunicipal();
      return new IndiceEsfera(legislativo, executivo);
    },

    legislativoMunicipal: function() {
      var regular   = new CargoMunicipalPopulacao(this.repo, 'vereador');
      var distrital = new CargoDistritalPopulacao(this.repo, 'deputado_distrital');
      return new IndiceSomaDistrital(new IndiceCargo(regular), new IndiceCargo(distrital));
    },

    executivoMunicipal: function() {
      var regular   = new CargoMunicipalPopulacao(this.repo, 'prefeito');
      var distrital = new CargoDistritalPopulacao(this.repo, 'governador');
      return new IndiceSomaDistrital(new IndiceCargo(regular), new IndiceCargo(distrital));
    },

  });

  this.GeradorDeIndices = GeradorDeIndices;

}.call(this, _));
