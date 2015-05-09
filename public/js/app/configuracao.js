"use strict";

(function(_) {

  window.Configuracao = (function() {

    function Configuracao() {
      // Variáveis para configurar partidos
      this.mudancasDeNome    = true;
      this.incorporacoes     = true;
      this.fusoes            = true;
      this.tabelaDeReescrita = null;

      // Faz correções para gráficos em passos
      this.ehGraficoEmPassos = false;

      // Faz correções para gráficos de área
      this.ehGraficoDeArea   = false;
    }

    Configuracao.regiaoSul         = [ 'PR', 'RS', 'SC' ];
    Configuracao.regiaoSudeste     = [ 'ES', 'MG', 'RJ', 'SP' ];
    Configuracao.regiaoCentroOeste = [ 'DF', 'GO', 'MS', 'MT' ];
    Configuracao.regiaoNorte       = [ 'AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO' ];
    Configuracao.regiaoNordeste    = [ 'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE' ];

    Configuracao.brasil = _.flatten([
      Configuracao.regiaoSul,
      Configuracao.regiaoSudeste,
      Configuracao.regiaoCentroOeste,
      Configuracao.regiaoNorte,
      Configuracao.regiaoNordeste
    ]).sort();

    Configuracao.partidosEmGrupos = {
      grandes: [
        { sigla: 'PMDB',   numero: 15, fundado: 1979, nome: 'Partido do Movimento Democrático Brasileiro' },
        { sigla: 'PT',     numero: 13, fundado: 1979, nome: 'Partido dos Trabalhadores' },
        { sigla: 'PSDB',   numero: 45, fundado: 1988, nome: 'Partido da Social Democracia Brasileira' },
      ],
      medios: [
        { sigla: 'PTB',    numero: 14, fundado: 1979, nome: 'Partido Trabalhista Brasileiro' },
        { sigla: 'PDT',    numero: 12, fundado: 1979, nome: 'Partido Democrático Trabalhista' },
        { sigla: 'PSB',    numero: 40, fundado: 1988, nome: 'Partido Socialista Brasileiro' },
        { sigla: 'PP',     numero: 11, fundado: 2003, nome: 'Partido Progressista' },
        { sigla: 'PR',     numero: 22, fundado: 2006, nome: 'Partido Republicano' },
        { sigla: 'DEM',    numero: 25, fundado: 2007, nome: 'Democratas' },
        { sigla: 'PSD',    numero: 55, fundado: 2011, nome: 'Partido Social Democrático' },
      ],
      pequenos: [
        { sigla: 'PSC',    numero: 20, fundado: 1985, nome: 'Partido Social Cristão' },
        { sigla: 'PCdoB',  numero: 65, fundado: 1987, nome: 'Partido Comunista do Brasil' },
        { sigla: 'PV',     numero: 43, fundado: 1990, nome: 'Partido Verde' },
        { sigla: 'PPS',    numero: 23, fundado: 1992, nome: 'Partido Popular Socialista' },
        { sigla: 'PRB',    numero: 10, fundado: 2005, nome: 'Partido Republicano Brasileiro' },
        { sigla: 'PSOL',   numero: 50, fundado: 2005, nome: 'Partido Socialismo e Liberdade' },
        { sigla: 'PROS',   numero: 90, fundado: 2013, nome: 'Partido Republicano da Ordem Social' },
        { sigla: 'SD',     numero: 77, fundado: 2013, nome: 'Solidariedade' },
      ],
      nanicos: [
        { sigla: 'PMN',    numero: 33, fundado: 1989, nome: 'Partido da Mobilização Nacional' },
        { sigla: 'PRP',    numero: 44, fundado: 1989, nome: 'Partido Republicano Progressista' },
        { sigla: 'PSL',    numero: 17, fundado: 1994, nome: 'Partido Social Liberal' },
        { sigla: 'PRTB',   numero: 28, fundado: 1995, nome: 'Partido Renovador Trabalhista Brasileiro' },
        { sigla: 'PTN',    numero: 19, fundado: 1995, nome: 'Partido Trabalhista Nacional' },
        { sigla: 'PSDC',   numero: 27, fundado: 1995, nome: 'Partido Social Democrata Cristão' },
        { sigla: 'PTC',    numero: 36, fundado: 2000, nome: 'Partido Trabalhista Cristão' },
        { sigla: 'PHS',    numero: 31, fundado: 2000, nome: 'Partido Humanista da Solidariedade' },
        { sigla: 'PEN',    numero: 51, fundado: 2011, nome: 'Partido Ecológico Nacional' },
      ],
      fora_do_congresso: [
        { sigla: 'PTdoB',  numero: 70, fundado: 1989, nome: 'Partido Trabalhista do Brasil' },
        { sigla: 'PSTU',   numero: 16, fundado: 1993, nome: 'Partido Socialista dos Trabalhadores Unificado' },
        { sigla: 'PCB',    numero: 21, fundado: 1993, nome: 'Partido Comunista Brasileiro' },
        { sigla: 'PCO',    numero: 29, fundado: 1995, nome: 'Partido da Causa Operária' },
        { sigla: 'PPL',    numero: 54, fundado: 2009, nome: 'Partido Pátria Livre' },
      ],
      mudancas_de_nome: [
        { sigla: 'PJ',     numero: 36, fundado: 1985, extinto: 1989, renomeado: 'PRN',  nome: 'Partido da Juventude' },
        { sigla: 'PCB',    numero: 23, fundado: 1987, extinto: 1992, renomeado: 'PPS',  nome: 'Partido Comunista Brasileiro', naoEhUltimo: true },
        { sigla: 'PTR',    numero: 28, fundado: 1985, extinto: 1993, renomeado: 'PP',   nome: 'Partido Trabalhista Renovador' },
        { sigla: 'PRT',    numero: 16, fundado: 1992, extinto: 1993, renomeado: 'PSTU', nome: 'Partido Revolucionário dos Trabalhadores' },
        { sigla: 'PTRB',   numero: 17, fundado: 1993, extinto: 1995, renomeado: 'PRTB', nome: 'Partido Trabalhista Renovador Brasileiro' },
        { sigla: 'PDC',    numero: 27, fundado: 1995, extinto: 1995, renomeado: 'PSDC', nome: 'Partido Democrata Cristão' },
        { sigla: 'PSN',    numero: 31, fundado: 1995, extinto: 1997, renomeado: 'PSN',  nome: 'Partido Solidarista Nacional' },
        { sigla: 'PRN',    numero: 36, fundado: 1989, extinto: 2000, renomeado: 'PTC',  nome: 'Partido da Reconstrução Nacional' },
        { sigla: 'PSN',    numero: 31, fundado: 1997, extinto: 2000, renomeado: 'PHS',  nome: 'Partido da Solidariedade Nacional' },
        { sigla: 'PPB',    numero: 11, fundado: 1995, extinto: 2003, renomeado: 'PP',   nome: 'Partido Progressista Brasileiro' },
        { sigla: 'PFL',    numero: 25, fundado: 1985, extinto: 2007, renomeado: 'DEM',  nome: 'Partido da Frente Liberal' },
      ],
      incorporacoes: [
        { sigla: 'PASART', numero: 30, fundado: 1985, extinto: 1990, incorporado: 'PTdoB', nome: 'Partido Socialista Agrário Renovador Trabalhista' },
        { sigla: 'PST',    numero: 52, fundado: 1989, extinto: 1993, incorporado: 'PTR',   nome: 'Partido Social Trabalhista', naoEhUltimo: true },
        { sigla: 'PSD',    numero: 41, fundado: 1987, extinto: 2003, incorporado: 'PTB',   nome: 'Partido Social Democrático', naoEhUltimo: true },
        { sigla: 'PGT',    numero: 30, fundado: 1995, extinto: 2003, incorporado: 'PL',    nome: 'Partido Geral dos Trabalhadores' },
        { sigla: 'PST',    numero: 18, fundado: 1996, extinto: 2003, incorporado: 'PL',    nome: 'Partido Social Trabalhista' },
        { sigla: 'PAN',    numero: 26, fundado: 1998, extinto: 2006, incorporado: 'PTB',   nome: 'Partido dos Aposentados da Nação' },
      ],
      fusoes: [
        { sigla: 'PDS',    numero: 11, fundado: 1980, extinto: 1993, fusao: 'PPR', nome: 'Partido Democrático Social' },
        { sigla: 'PDC',    numero: 17, fundado: 1985, extinto: 1993, fusao: 'PPR', nome: 'Partido Democrata Cristão' },
        { sigla: 'PP',     numero: 39, fundado: 1993, extinto: 1995, fusao: 'PPB', nome: 'Partido Progressista', naoEhUltimo: true },
        { sigla: 'PPR',    numero: 11, fundado: 1993, extinto: 1995, fusao: 'PPB', nome: 'Partido Progressista Reformador' },
        { sigla: 'PL',     numero: 22, fundado: 1985, extinto: 2006, fusao: 'PR', nome: 'Partido Liberal' },
        { sigla: 'PRONA',  numero: 56, fundado: 1989, extinto: 2006, fusao: 'PR', nome: 'Partido de Reedificação da Ordem Nacional' },
      ],
      extintos: [
        { sigla: 'PMB',    numero: 26, fundado: 1985, extinto: 1989, nome: 'Partido Municipalista Brasileiro' },
        { sigla: 'PCN',    numero: 31, fundado: 1988, extinto: 1991, nome: 'Partido Comunitário Nacional' },
        { sigla: 'PTN',    numero: 21, fundado: 1986, extinto: 1986, nome: 'Partido Trabalhista Nacional', naoEhUltimo: true },
        { sigla: 'PSL',    numero: 59, fundado: 1989, extinto: 1992, nome: 'Partido do Solidarismo Libertador', naoEhUltimo: true },
        { sigla: 'PNT',    numero: 67, fundado: 1990, extinto: 1990, nome: 'Partido Nacionalista dos Trabalhadores' },
        { sigla: 'PRS',    numero: 71, fundado: 1990, extinto: 1992, nome: 'Partido das Reformas Sociais' },
      ],
    };

    Configuracao.partidos = _.flatten(_.values(Configuracao.partidosEmGrupos));

    Configuracao.top9 = {
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
      ],
      resto: 'Resto'
    };

    Configuracao.top3 = {
      mapear: [
        { de: { sigla: 'PT',   numero: 13 }, para: 'PT' },
        { de: { sigla: 'PMDB', numero: 15 }, para: 'PMDB' },
        { de: { sigla: 'PSDB', numero: 45 }, para: 'PSDB' },
      ],
      resto: 'Resto'
    };

    Configuracao.partidosAntigos = {
      mapear: [
        { de: { sigla: 'PDS',     numero: 11 }, para: 'ARENA' },
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

    Configuracao.prototype.anosComIndice = function(anos, fundado, extinto, manterTodosAnos) {

      var anos = anos.slice();

      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.ehGraficoEmPassos === true) {
        anos.push(_.max(anos) + 1);
      }

      if (this.ehGraficoDeArea === false && this.tabelaDeReescrita == null) {

        // Partido novo
        if ((fundado - 1) > _.min(anos)) {
          // Remove anos antes da fundação
          manterTodosAnos || (anos = _.filter(anos, function(ano) { return ano >= fundado }));
        }

        // Partido morto
        if (extinto != null) {
          // O partido nem chega a aparecer no gráfico
          if (extinto < _.min(anos)) {
            manterTodosAnos || (anos = []);
          } else {
            // Remove anos depois da dissolução
            manterTodosAnos || (anos = _.filter(anos, function(ano) { return ano <= extinto }));
          }
        }

      }

      return anos;

    }

    var somarIndicesDosRepetidos = function(dados, mapFunction) {
      return _.map(dados, function(partidos) {
        if (partidos.length == 1) {
          return partidos[0];
        }

        var todosOsIndices = _.flatten(_.pluck(partidos, 'indices'));

        var indicesPorAno = _.groupBy(todosOsIndices, function(i) { return i[0] });

        var somasDosIndicesPorAno = _.map(_.values(indicesPorAno), function(indices) {
          var ano = indices[0][0];
          var somaDosIndices = _.reduce(indices, function(memo, i) { return memo + i[1] }, 0);
          return [ ano, somaDosIndices ];
        });

        return mapFunction(partidos, somasDosIndicesPorAno);
      });
    };

    Configuracao.prototype.mesclarPartidosExtintos = function(dados) {

      var _this = this;
      var migrouUmPartido = false;

      // Realiza migrações
      var migrados = _.flatten(_.map(dados, function(partido) {

        var infos = _.filter(Configuracao.partidos, function(info) {
          return partido.sigla   === info.sigla &&
                 partido.numero  === info.numero &&
                 (partido.extinto == null || info.extinto == null || partido.extinto == info.extinto);
        });

        return _.map(infos, function(info) {

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

              infoDestino = _.find(Configuracao.partidos, function(infoDestino) {
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
            fundado: partido.fundado || info.fundado,
            extinto: infoDestino.extinto,
            indices: partido.indices
          };

        });

      }));

      if (migrouUmPartido === true) {

        // Agrupa repetidos
        var porSigla = _.groupBy(migrados, function(partido) {
          return partido.sigla + partido.numero
        });

        // Soma índices
        var mesclados = somarIndicesDosRepetidos(_.values(porSigla), function(lista, somas) {
          return {
            sigla:   lista[0].sigla,
            numero:  lista[0].numero,
            fundado: _.min(lista, function(p) { return p.fundado }).fundado,
            extinto: lista[0].extinto,
            indices: somas
          }
        });

        // Reaplica migrações nos novos dados
        return this.mesclarPartidosExtintos(mesclados);

      }

      return migrados;
    }

    Configuracao.prototype.reescreverSiglas = function(dados) {

      var _this = this;

      if (this.tabelaDeReescrita == null) {

        return _.map(dados, function(partido) {

          var info = _.find(Configuracao.partidos, function(info) {
            return partido.sigla  === info.sigla &&
                   partido.numero === info.numero;
          });

          var sigla = info.naoEhUltimo === true ? (info.sigla + " (" + info.fundado.toString() + ")") : info.sigla;

          return { sigla: sigla, indices: partido.indices };

        });

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
      var mesclados = somarIndicesDosRepetidos(_.values(porSigla), function(lista, somas) {
        return { sigla: lista[0].sigla, indices: somas }
      });

      return mesclados;

    };

    return Configuracao;

  })();

})(_);
