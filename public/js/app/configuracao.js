/* globals ipl, _ */
/* exported ipl.ConfiguracaoDePartidos */

;(function(ipl, _) {
  'use strict';

  function ConfiguracaoDePartidos(repo) {
    this.repo = repo;

    this.mudancasDeNome    = true;
    this.incorporacoes     = true;
    this.fusoes            = true;
    this.tabelaDeReescrita = null;
  }

  ConfiguracaoDePartidos.top10 = {
    mapear: [
      { de: { sigla: 'PT',    numero: 13 }, para: 'PT' },
      { de: { sigla: 'PMDB',  numero: 15 }, para: 'PMDB' },
      { de: { sigla: 'PSDB',  numero: 45 }, para: 'PSDB' },
      { de: { sigla: 'PSB',   numero: 40 }, para: 'PSB' },
      { de: { sigla: 'PFL',   numero: 25 }, para: 'DEM' },
      { de: { sigla: 'DEM',   numero: 25 }, para: 'DEM' },
      { de: { sigla: 'PST',   numero: 52 }, para: 'PP' },
      { de: { sigla: 'PTR',   numero: 28 }, para: 'PP' },
      { de: { sigla: 'PP',    numero: 39 }, para: 'PP' },
      { de: { sigla: 'PDS',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PDC',   numero: 17 }, para: 'PP' },
      { de: { sigla: 'PPR',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PPB',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PP',    numero: 11 }, para: 'PP' },
      { de: { sigla: 'PL',    numero: 22 }, para: 'PR' },
      { de: { sigla: 'PRONA', numero: 56 }, para: 'PR' },
      { de: { sigla: 'PR',    numero: 22 }, para: 'PR' },
      { de: { sigla: 'PDT',   numero: 12 }, para: 'PDT' },
      { de: { sigla: 'PTB',   numero: 14 }, para: 'PTB' },
      { de: { sigla: 'PAN',   numero: 26 }, para: 'PTB' },
      { de: { sigla: 'PSD',   numero: 41 }, para: 'PTB' },
      { de: { sigla: 'PSD',   numero: 55 }, para: 'PSD' },
    ],
    resto: 'Resto'
  };

  ConfiguracaoDePartidos.top3 = {
    mapear: [
      { de: { sigla: 'PT',   numero: 13 }, para: 'PT' },
      { de: { sigla: 'PMDB', numero: 15 }, para: 'PMDB' },
      { de: { sigla: 'PSDB', numero: 45 }, para: 'PSDB' },
    ],
    resto: 'Resto'
  };

  ConfiguracaoDePartidos.partidosAntigos = {
    mapear: [
      { de: { sigla: 'PDS',    numero: 11 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PPR',    numero: 11 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PPB',    numero: 11 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PP',     numero: 11 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PFL',    numero: 25 }, para: 'ARENA (1965)' },
      { de: { sigla: 'DEM',    numero: 25 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PSD',    numero: 55 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PL',     numero: 22 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PR',     numero: 22 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PRB',    numero: 10 }, para: 'ARENA (1965)' },
      { de: { sigla: 'PMDB',   numero: 15 }, para: 'MDB (1965)' },
      { de: { sigla: 'PSDB',   numero: 45 }, para: 'MDB (1965)' },
      { de: { sigla: 'PT',     numero: 13 }, para: 'PT (1979)' },
      { de: { sigla: 'PSTU',   numero: 16 }, para: 'PT (1979)' },
      { de: { sigla: 'PSOL',   numero: 50 }, para: 'PT (1979)' },
      { de: { sigla: 'PCO',    numero: 29 }, para: 'PT (1979)' },
      { de: { sigla: 'PSB',    numero: 40 }, para: 'PSB (1947)' },
      { de: { sigla: 'PTB',    numero: 14 }, para: 'PTB (1945)' },
      { de: { sigla: 'PTN',    numero: 19 }, para: 'PTB (1945)' },
      { de: { sigla: 'PASART', numero: 30 }, para: 'PTB (1945)' },
      { de: { sigla: 'PNT',    numero: 67 }, para: 'PTB (1945)' },
      { de: { sigla: 'PNTB',   numero: 81 }, para: 'PTB (1945)' },
      { de: { sigla: 'PTdoB',  numero: 70 }, para: 'PTB (1945)' },
      { de: { sigla: 'PDT',    numero: 12 }, para: 'PTB (1945)' },
      { de: { sigla: 'SD',     numero: 77 }, para: 'PTB (1945)' },
      { de: { sigla: 'PCB',    numero: 21 }, para: 'PCB (1922)' },
      { de: { sigla: 'PPS',    numero: 23 }, para: 'PCB (1922)' },
      { de: { sigla: 'PCdoB',  numero: 65 }, para: 'PCB (1922)' },
      { de: { sigla: 'PPL',    numero: 54 }, para: 'PCB (1922)' }
    ],
    resto: 'Resto'
  };

  function somarIndicesDosRepetidos(agrupadosPorSigla, callback, thisArg) {
    return _.map(agrupadosPorSigla, function(partidos) {

      if (partidos.length === 1) {
        return partidos[0];
      }

      var todasAsLinhas = _.flatten(_.pluck(partidos, 'indices'));

      var linhasPorAno = _.values(_.groupBy(todasAsLinhas, 'ano'));

      var somasDosIndicesPorAno = _.map(linhasPorAno, function(linhas) {
        return { ano: linhas[0].ano, indice: _.sum(linhas, 'indice') };
      });

      return callback.call(thisArg, partidos, somasDosIndicesPorAno);

    });
  }

  ConfiguracaoDePartidos.prototype = {

    mesclarPartidosExtintos: function(partidos) {
      var migrouUmPartido = false;

      // Procurar partidos sucessores
      var processados = _.map(partidos, function(partido) {

        // Se o partido não for extinto
        if (partido.info.extinto == null) {
          return partido;
        }

        // Se não tem sucessor ou não está configurado para mesclar
        if ((this.mudancasDeNome === false || partido.info.renomeado   == null) &&
            (this.incorporacoes  === false || partido.info.incorporado == null) &&
            (this.fusoes         === false || partido.info.fusao       == null)) {
          return partido;
        }

        migrouUmPartido = true;

        var sucessor = this.repo.buscarSucessor(partido.info);

        return {
          sigla:     sucessor.sigla,
          numero:    sucessor.numero,
          fundado:   partido.fundado,
          extinto:   sucessor.extinto,
          indices:   partido.indices,
          info:      sucessor,
          mesclados: partido.mesclados.concat([ partido.info ])
        };

      }, this);

      if (migrouUmPartido === true) {

        // Agrupa repetidos
        var porPartido = _.values(_.groupBy(processados, function(partido) {
          return partido.sigla + partido.numero + (partido.extinto || '');
        }));

        // Soma índices
        var mesclados = somarIndicesDosRepetidos(porPartido, function(lista, somas) {
          return {
            sigla:     lista[0].sigla,
            numero:    lista[0].numero,
            fundado:   _.min(lista, 'fundado').fundado,
            extinto:   lista[0].extinto,
            indices:   somas,
            info:      lista[0].info,
            mesclados: lista[0].mesclados
          };
        });

        // Reaplica migrações nos novos dados
        return this.mesclarPartidosExtintos(mesclados);

      }

      return processados;
    },

    desambiguarSiglas: function(partidos) {
      return _.map(partidos, function(p) {
        // Desambígua siglas com mesmo nome
        var siglaDesambiguada = p.info.naoEhUltimo === true ?
          (p.info.sigla + ' (' + p.info.fundado.toString() + ')') :
          p.info.sigla;
        return _.assign({}, p, { sigla: siglaDesambiguada });
      });
    },

    agruparPartidos: function(partidos) {

      // Realiza migrações
      var migrados = _.map(partidos, function(p) {
        var de = { de: _.pick(p, [ 'sigla', 'numero' ]) };
        var config = _.find(this.tabelaDeReescrita.mapear, de);
        return _.assign({}, p, {
          sigla: config != null ?
            config.para :
            this.tabelaDeReescrita.resto
        });
      }, this);

      // Agrupa repetidos
      var porSigla = _.values(_.groupBy(migrados, 'sigla'));

      // Soma índices
      var mesclados = somarIndicesDosRepetidos(porSigla, function(partidos, somas) {

        var sigla = partidos[0].sigla;

        var todosOsPartidos = _.flatten(_.map(partidos, function(p) {
          return [ p.info ].concat(p.mesclados);
        }));

        var info = null, mesclados = todosOsPartidos;
        if (sigla !== this.tabelaDeReescrita.resto) {

          var primeiroMapeado = _.find(this.tabelaDeReescrita.mapear, 'para', sigla);
          info = _.find(todosOsPartidos, primeiroMapeado.de);

          if (info != null) {
            mesclados = _.without(mesclados, info);
          } else {
            info = this.repo.buscar(primeiroMapeado.de);
          }
        }

        return {
          sigla:     sigla,
          fundado:   _.min(partidos, 'fundado').fundado,
          extinto:   _.all(partidos, 'extinto') ? _.max(partidos, 'extinto').extinto : null,
          indices:   somas,
          info:      info,
          mesclados: mesclados
        };

      }, this);

      return mesclados;

    },

    mapearPartidos: function(indicesPorSigla) {
      var partidos = _.map(indicesPorSigla, function(p) {
        return _.assign({}, p, {
          sigla:     p.info.sigla,
          numero:    p.info.numero,
          fundado:   p.info.fundado,
          extinto:   p.info.extinto,
          mesclados: []
        });
      });
      partidos = this.mesclarPartidosExtintos(partidos);
      if (this.tabelaDeReescrita == null) {
        return this.desambiguarSiglas(partidos);
      } else {
        return this.agruparPartidos(partidos);
      }
    },

  };

  ipl.ConfiguracaoDePartidos = ConfiguracaoDePartidos;

})(ipl, _);
