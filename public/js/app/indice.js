/* global _ */
/* exported Cargo, Indice, RepositorioDeIndices */

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

  function RepositorioDeIndices(repositorioEleitoral) {
    this.repo = repositorioEleitoral;
  }

  _.extend(RepositorioDeIndices.prototype, {

    deputadosFederais: _.memoize(function() {
      return new IndiceCargo(new CargoFederal(this.repo, 'deputado_federal'));
    }),

    senadores: _.memoize(function() {
      return new IndiceCargo(new CargoFederalRenovaMetade(this.repo, 'senador'));
    }),

    presidentes: _.memoize(function() {
      return new IndiceCargo(new CargoFederal(this.repo, 'presidente'));
    }),

    deputadosEstaduais: _.memoize(function(metodo) {
      var cargo = { populacao: CargoEstadualPopulacao, nominal: CargoEstadual }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'deputado_estadual'));
    }),

    governadoresEstaduais: _.memoize(function(metodo) {
      var cargo = { populacao: CargoEstadualPopulacao, nominal: CargoEstadual }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'governador'));
    }),

    deputadosDistritais: _.memoize(function(metodo) {
      var cargo = { populacao: CargoDistritalPopulacao, nominal: CargoDistrital }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'deputado_distrital'));
    }),

    governadoresDistritais: _.memoize(function(metodo) {
      var cargo = { populacao: CargoDistritalPopulacao, nominal: CargoDistrital }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'governador'));
    }),

    vereadores: _.memoize(function(metodo) {
      var cargo = { populacao: CargoMunicipalPopulacao, nominal: CargoMunicipal }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'vereador'));
    }),

    prefeitos: _.memoize(function(metodo) {
      var cargo = { populacao: CargoMunicipalPopulacao, nominal: CargoMunicipal }[metodo];
      return new IndiceCargo(new cargo(this.repo, 'prefeito'));
    }),

  });

  this.Cargo = Cargo;
  this.Indice = Indice;
  this.RepositorioDeIndices = RepositorioDeIndices;

}.call(this, _));
