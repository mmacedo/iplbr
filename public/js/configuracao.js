;(function() {

  window.Configuracao = (function() {

    function Configuracao() {
      // Variáveis para calcular o índice
      this.metodoPesoUe   = 'populacao';
      this.pesoExecutivo  = 0.25;

      // Variáveis para configurar partidos
      this.mudancasDeNome    = true;
      this.incorporacoes     = true;
      this.fusoes            = true;
      this.tabelaDeReescrita = null;

      // Faz correções para gráficos em passos
      this.ehGraficoEmPassos = false;

      // Faz correções para gráficos de área
      this.ehGraficoDeArea = false;

      // Deixa gráficos de linha mais bonitos, mas estraga gráficos empilhados
      this.mostraFundacaoEDissolucao = true;
    }

    Configuracao.regiaoSul         = [ 'PR', 'RS', 'SC' ];
    Configuracao.regiaoSudeste     = [ 'ES', 'MG', 'RJ', 'SP' ];
    Configuracao.regiaoCentroOeste = [ 'DF', 'GO', 'MS', 'MT' ];
    Configuracao.regiaoNorte       = [ 'AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO' ];
    Configuracao.regiaoNordeste    = [ 'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE' ];

    Configuracao.tabelaDeUfs = _.flatten([
      Configuracao.regiaoSul,
      Configuracao.regiaoSudeste,
      Configuracao.regiaoCentroOeste,
      Configuracao.regiaoNorte,
      Configuracao.regiaoNordeste
    ]).sort();

    Configuracao.tabelaDePartidos = [
      { sigla: 'PRB',     numero: 10, fundado: 2005 },
      { sigla: 'PPR',     numero: 11, fundado: 1993, extinto: 1995, fusao: 'PPB' },
      { sigla: 'PPB',     numero: 11, fundado: 1995, extinto: 2003, renomeado: 'PP' },
      { sigla: 'PP',      numero: 11, fundado: 2003 },
      { sigla: 'PDT',     numero: 12, fundado: 1979 },
      { sigla: 'PT',      numero: 13, fundado: 1980 },
      { sigla: 'PTB',     numero: 14, fundado: 1980 },
      { sigla: 'PMDB',    numero: 15, fundado: 1980 },
      { sigla: 'PSTU',    numero: 16, fundado: 1993 },
      { sigla: 'PTRB',    numero: 17, fundado: 1993, extinto: 1995, renomeado: 'PRTB' },
      { sigla: 'PSL',     numero: 17, fundado: 1994 },
      { sigla: 'PST',     numero: 18, fundado: 1996, extinto: 2003, incorporado: 'PL' },
      { sigla: 'PTN',     numero: 19, fundado: 1995 },
      { sigla: 'PSC',     numero: 20, fundado: 1985 },
      { sigla: 'PCB',     numero: 21, fundado: 1996 },
      { sigla: 'PL',      numero: 22, fundado: 1985, extinto: 2006, fusao: 'PR' },
      { sigla: 'PR',      numero: 22, fundado: 2006 },
      { sigla: 'PPS',     numero: 23, fundado: 1992 },
      { sigla: 'PFL',     numero: 25, fundado: 1988, extinto: 2007, renomeado: 'DEM' },
      { sigla: 'DEM',     numero: 25, fundado: 2007 },
      { sigla: 'PAN',     numero: 26, fundado: 1998, extinto: 2006, incorporado: 'PTB' },
      { sigla: 'PSDC',    numero: 27, fundado: 1997 },
      { sigla: 'PRTB',    numero: 28, fundado: 1997 },
      { sigla: 'PCO',     numero: 29, fundado: 1995 },
      { sigla: 'PGT',     numero: 30, fundado: 1995, extinto: 2003, incorporado: 'PL' },
      { sigla: 'PSN',     numero: 31, fundado: 1997, extinto: 2003, renomeado: 'PHS' },
      { sigla: 'PHS',     numero: 31, fundado: 2003 },
      { sigla: 'PMN',     numero: 33, fundado: 1984 },
      { sigla: 'PRN',     numero: 36, fundado: 1989, extinto: 2000, renomeado: 'PTC' },
      { sigla: 'PTC',     numero: 36, fundado: 2000 },
      { sigla: 'PP',      numero: 39, fundado: 1993, extinto: 1995, fusao: 'PPB' },
      { sigla: 'PSB',     numero: 40, fundado: 1988 },
      { sigla: 'PSD',     numero: 41, fundado: 1987, extinto: 2003, incorporado: 'PTB' },
      { sigla: 'PV',      numero: 43, fundado: 1993 },
      { sigla: 'PRP',     numero: 44, fundado: 1991 },
      { sigla: 'PSDB',    numero: 45, fundado: 1988 },
      { sigla: 'PSOL',    numero: 50, fundado: 2004 },
      { sigla: 'PEN',     numero: 51, fundado: 2011 },
      { sigla: 'PEN',     numero: 51, fundado: 2011 },
      { sigla: 'PPL',     numero: 54, fundado: 2009 },
      { sigla: 'PSD',     numero: 55, fundado: 2011 },
      { sigla: 'PRONA',   numero: 56, fundado: 1989, extinto: 2006, fusao: 'PR' },
      { sigla: 'PC do B', numero: 65, fundado: 1988 },
      { sigla: 'PT do B', numero: 70, fundado: 1989 },
      { sigla: 'SD',      numero: 77, fundado: 2013 },
      { sigla: 'PROS',    numero: 90, fundado: 2013 }
    ];

    Configuracao.tabelaTop10 = {
      mapear: [
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'PMDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'PSDB' },
        { de: { sigla: 'PSB',     numero: 40 }, para: 'PSB' },
        { de: { sigla: 'PFL',     numero: 25 }, para: 'DEM' },
        { de: { sigla: 'DEM',     numero: 25 }, para: 'DEM' },
        { de: { sigla: 'PP',      numero: 39 }, para: 'PP' },
        { de: { sigla: 'PPR',     numero: 11 }, para: 'PP' },
        { de: { sigla: 'PPB',     numero: 11 }, para: 'PP' },
        { de: { sigla: 'PP',      numero: 11 }, para: 'PP' },
        { de: { sigla: 'PSD',     numero: 55 }, para: 'PSD' },
        { de: { sigla: 'PL',      numero: 22 }, para: 'PR' },
        { de: { sigla: 'PRONA',   numero: 56 }, para: 'PR' },
        { de: { sigla: 'PR',      numero: 22 }, para: 'PR' },
        { de: { sigla: 'PDT',     numero: 12 }, para: 'PDT' },
        { de: { sigla: 'PTB',     numero: 14 }, para: 'PTB' },
      ],
      resto: 'Resto'
    };

    Configuracao.tabelaTop3 = {
      mapear: [
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'PMDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'PSDB' },
      ],
      resto: 'Resto'
    };

    Configuracao.tabelaDePartidosAntigos = {
      mapear: [
        { de: { sigla: 'PPR',     numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PPB',     numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PP',      numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PFL',     numero: 25 }, para: 'ARENA' },
        { de: { sigla: 'DEM',     numero: 25 }, para: 'ARENA' },
        { de: { sigla: 'PSD',     numero: 55 }, para: 'ARENA' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'MDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'MDB' },
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PSTU',    numero: 16 }, para: 'PT' },
        { de: { sigla: 'PSOL',    numero: 50 }, para: 'PT' },
        { de: { sigla: 'PCO',     numero: 29 }, para: 'PT' },
        { de: { sigla: 'PSB',     numero: 40 }, para: 'PSB' },
        { de: { sigla: 'PTB',     numero: 14 }, para: 'Antigo PTB' },
        { de: { sigla: 'PT do B', numero: 70 }, para: 'Antigo PTB' },
        { de: { sigla: 'PDT',     numero: 12 }, para: 'Antigo PTB' },
        { de: { sigla: 'SD',      numero: 77 }, para: 'Antigo PTB' },
        { de: { sigla: 'PCB',     numero: 21 }, para: 'PCB' },
        { de: { sigla: 'PPS',     numero: 23 }, para: 'PCB' },
        { de: { sigla: 'PC do B', numero: 65 }, para: 'PCB' },
        { de: { sigla: 'PPL',     numero: 54 }, para: 'PCB' }
      ],
      resto: 'Resto'
    };

    Configuracao.prototype.filtrarAnos = function(anos, fundado, extinto, manterTodosAnos) {

      var anos = anos.slice();

      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.passos === true) {
        anos.push(_.max(anos) + 1);
      }

      if (this.mostraFundacaoEDissolucao === true && this.tabelaDeReescrita == null) {

        // Partido novo
        if ((fundado - 1) > _.min(anos)) {
          // Remove anos antes da fundação
          manterTodosAnos || (anos = _.filter(anos, function(ano) { return ano >= fundado }));
          // Adiciona ano da fundação
          anos.push(fundado - 1);
        }

        // Partido morto
        if (extinto != null) {
          // O partido nem chega a aparecer no gráfico
          if (extinto < _.min(anos)) {
            manterTodosAnos || (anos = []);
          } else {
            // Remove anos depois da dissolução
            manterTodosAnos || (anos = _.filter(anos, function(ano) { return ano <= extinto }));
            // Adiciona ano da dissolução, normalmente iria até a última eleição
            if ((extinto - 1) > _.max(anos)) {
              anos.push(extinto - 1);
            }
          }
        }

      }

      return anos;

    }

    var mesclarESomarIndices = function(dados, mapFunction) {
      return _.map(dados, function(partidos) {
        if (partidos.length == 1) {
          return partidos[0];
        }

        var todosOsIndices = _.flatten(_.pluck(partidos, 'indices'), true);

        var indicesPorAno = _.groupBy(todosOsIndices, function(i) { return i[0] });

        var somasDosIndicesPorAno = _.map(_.values(indicesPorAno), function(indices) {
          var ano = indices[0][0];
          var somaDosIndices = _.reduce(indices, function(memo, i) { return memo + i[1] }, 0);
          return [ ano, somaDosIndices ];
        });

        return mapFunction(partidos, somasDosIndicesPorAno);
      });
    };

    Configuracao.prototype.corrigirDados = function(dados) {

      var _this = this;
      var migrouUmPartido = false;

      // Realiza migrações
      var migrados = _.map(dados, function(partido) {

        var info = _.find(Configuracao.tabelaDePartidos, function(info) {
          return partido.sigla  === info.sigla &&
                 partido.numero === info.numero;
        });

        var infoDestino = info;

        // Apenas partidos extintos podem ser migrados
        if (info.extinto != null) {

          var mesclarCom = null;
          if (_this.mudancasDeNome === true && info.renomeado != null) {
            mesclarCom = info.renomeado;
          } else if (_this.incorporacoes === true && info.incorporado != null) {
            mesclarCom = info.incorporado;
          } else if (_this.fusoes === true && info.fusao != null) {
            mesclarCom = info.fusao;
          }

          if (mesclarCom != null) {

            migrouUmPartido = true;

            infoDestino = _.find(Configuracao.tabelaDePartidos, function(infoDestino) {
              return (
                (mesclarCom === infoDestino.sigla) &&
                (infoDestino.extinto == null                    || infoDestino.extinto >= info.extinto) &&
                (info.incorporado == null                       || infoDestino.fundado <= info.extinto) &&
                ((info.renomeado == null && info.fusao == null) || infoDestino.fundado >= info.extinto));
            });

          }

        }

        return {
          sigla:   infoDestino.sigla,
          numero:  infoDestino.numero,
          fundado: partido.fundado == null ? info.fundado : partido.fundado,
          extinto: infoDestino.extinto,
          indices: partido.indices
        };

      });

      if (migrouUmPartido === true) {

        // Agrupa repetidos
        var porSigla = _.groupBy(migrados, function(partido) {
          return partido.sigla + partido.numero
        });

        // Soma índices
        var mesclados = mesclarESomarIndices(_.values(porSigla), function(lista, somas) {
          return {
            sigla:   lista[0].sigla,
            numero:  lista[0].numero,
            fundado: _.min(lista, function(p) { return p.fundado }).fundado,
            extinto: lista[0].extinto,
            indices: somas
          }
        });

        // Reaplica migrações nos novos dados
        return this.corrigirDados(mesclados);

      }

      return migrados;
    }

    Configuracao.prototype.reescreverSiglas = function(dados) {

      var _this = this;

      if (this.tabelaDeReescrita == null) {
        return dados;
      }

      // Realiza migrações
      var migrados = _.map(dados, function(partido) {
        var config = _.find(_this.tabelaDeReescrita.mapear, function(config) {
          return partido.sigla  === config.de.sigla &&
                 partido.numero === config.de.numero;
        });
        return {
          sigla: config != null ? config.para : _this.tabelaDeReescrita.resto,
          indices: partido.indices
        };
      });

      // Agrupa repetidos
      var porSigla = _.groupBy(migrados, function(partido) {
        return partido.sigla
      });

      // Soma índices
      var mesclados = mesclarESomarIndices(_.values(porSigla), function(lista, somas) {
        return { sigla: lista[0].sigla, indices: somas }
      });

      return mesclados;

    };

    return Configuracao;

  })();

})();
