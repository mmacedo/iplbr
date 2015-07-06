/* global _ */
/* exported RepositorioEleitoral */

(function(_) {
  'use strict';

  function RepositorioEleitoral(json) {
    this.json = json;
  }

  _.extend(RepositorioEleitoral.prototype, {

    anosDeEleicao: _.memoize(function(cargo, uf) {
      var anos = _.keys(this.json[uf][cargo]);
      return _.map(anos, function(ano) { return +ano; });
    }, function(cargo, uf) {
      return cargo + uf;
    }),

    mandatos: _.memoize(function(cargo, uf) {
      return _.map(this.anosDeEleicao(cargo, uf), function(ano) {
        return { inicio: ano, duracao: this.json[uf][cargo][ano]._mandato };
      }, this);
    }, function(cargo, uf) {
      return cargo + uf;
    }),

    mandatosAtivos: _.memoize(function(cargo, uf, ano) {
      var mandatos = this.mandatos(cargo, uf);
      var ativos = _.filter(mandatos, function(mandato) {
        return mandato.inicio <= ano &&
               mandato.inicio + mandato.duracao > ano;
      });
      return _.pluck(ativos, 'inicio');
    }, function(cargo, uf, ano) {
      return cargo + uf + ano;
    }),

    siglasComRepresentantes: _.memoize(function(cargo, uf, ano) {
      var siglas = _.keys(this.json[uf || 'BR'][cargo][ano]);
      return _.reject(siglas, function(sigla) { return _.startsWith(sigla, '_'); });
    }, function(cargo, uf, ano) {
      return cargo + uf + ano;
    }),

    total: function(cargo, uf, ano) {
      return this.json[uf || 'BR'][cargo][ano]._total;
    },

    populacao: function(uf, ano) {
      return this.json[uf].populacao[ano];
    },

    quantidade: function(cargo, uf, ano, sigla) {
      var anoNaUf = this.json[uf || 'BR'][cargo][ano];
      if (anoNaUf == null) {
        return 0;
      }
      var siglaNoAno = anoNaUf[sigla];
      if (siglaNoAno == null) {
        return 0;
      }
      return siglaNoAno.quantidade != null ? siglaNoAno.quantidade : siglaNoAno;
    },

    proporcionalAPopulacao: function(cargo, uf, ano, sigla) {
      var anoNaUf = this.json[uf || 'BR'][cargo][ano];
      if (anoNaUf == null) {
        return 0;
      }
      var siglaNoAno = anoNaUf[sigla];
      if (siglaNoAno == null) {
        return 0;
      }
      return siglaNoAno.populacao;
    },

  });

  this.RepositorioEleitoral = RepositorioEleitoral;

}.call(this, _));
