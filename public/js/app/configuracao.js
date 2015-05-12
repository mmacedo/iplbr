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

      // Usados no método 'cor'
      this._pilhaDeCores     = { 'verde': [], 'vermelho': [], 'laranja': [], 'azul': [], 'azul claro': [], 'roxo': [] };
      this._coresDosPartidos = {};

      // Inicia as cores de todos os partidos para evitar que sejam gerados cores diferentes toda vez
      var _this = this; _.each(Configuracao.partidos, function(p) { _this.cor(p); });
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

    Configuracao.cores = {
      'verde':      [ '#6ed854', '#a9ff97', '#00ff99' ],
      'vermelho':   [ '#df5353', '#E86850', '#dc143c', '#ed7db7' ],
      'laranja':    [ '#f7a35c', '#edb47e' ],
      'azul':       [ '#7cb5ec', '#3366cc', '#90b1d8', '#6699ff',  ],
      'azul claro': [ '#7eedeb', '#7dedeb' ],
      'roxo':       [ '#be55d9', '#7e80ed', '#996699' ],
    };

    Configuracao.partidosEmGrupos = {
      grandes: [
        { sigla: 'PMDB',   numero: 15, fundado: 1979,
          nome:  'Partido do Movimento Democrático Brasileiro',
          cor:   'verde' },
        { sigla: 'PT',     numero: 13, fundado: 1979,
          nome:  'Partido dos Trabalhadores',
          cor:   'vermelho' },
        { sigla: 'PSDB',   numero: 45, fundado: 1988,
          nome:  'Partido da Social Democracia Brasileira',
          cor:   'azul' },
      ],
      medios: [
        { sigla: 'PTB',    numero: 14, fundado: 1979,
          nome:  'Partido Trabalhista Brasileiro',
          cor:   'laranja' },
        { sigla: 'PDT',    numero: 12, fundado: 1979,
          nome:  'Partido Democrático Trabalhista',
          cor:   'vermelho' },
        { sigla: 'PSB',    numero: 40, fundado: 1988,
          nome:  'Partido Socialista Brasileiro',
          cor:   'vermelho' },
        { sigla: 'PP',     numero: 11, fundado: 2003,
          nome:  'Partido Progressista',
          cor:   'azul' },
        { sigla: 'PR',     numero: 22, fundado: 2006,
          nome:  'Partido Republicano',
          cor:   'azul' },
        { sigla: 'DEM',    numero: 25, fundado: 2007,
          nome:  'Democratas',
          cor:   'azul claro' },
        { sigla: 'PSD',    numero: 55, fundado: 2011,
          nome:  'Partido Social Democrático',
          cor:   'verde' },
      ],
      pequenos: [
        { sigla: 'PSC',    numero: 20, fundado: 1985,
          nome:  'Partido Social Cristão',
          cor:   'verde' },
        { sigla: 'PCdoB',  numero: 65, fundado: 1987,
          nome:  'Partido Comunista do Brasil',
          cor:   'vermelho' },
        { sigla: 'PV',     numero: 43, fundado: 1990,
          nome:  'Partido Verde',
          cor:   'verde' },
        { sigla: 'PPS',    numero: 23, fundado: 1992,
          nome:  'Partido Popular Socialista',
          cor:   'vermelho' },
        { sigla: 'PRB',    numero: 10, fundado: 2005,
          nome:  'Partido Republicano Brasileiro',
          cor:   'azul claro' },
        { sigla: 'PSOL',   numero: 50, fundado: 2005,
          nome:  'Partido Socialismo e Liberdade',
          cor:   'roxo' },
        { sigla: 'PROS',   numero: 90, fundado: 2013,
          nome:  'Partido Republicano da Ordem Social',
          cor:   'laranja' },
        { sigla: 'SD',     numero: 77, fundado: 2013,
          nome:  'Solidariedade',
          cor:   'laranja' },
      ],
      nanicos: [
        { sigla: 'PMN',    numero: 33, fundado: 1989,
          nome:  'Partido da Mobilização Nacional',
          cor:   'vermelho' },
        { sigla: 'PRP',    numero: 44, fundado: 1989,
          nome:  'Partido Republicano Progressista',
          cor:   'azul claro' },
        { sigla: 'PSL',    numero: 17, fundado: 1994,
          nome:  'Partido Social Liberal',
          cor:   'laranja' },
        { sigla: 'PRTB',   numero: 28, fundado: 1995,
          nome:  'Partido Renovador Trabalhista Brasileiro',
          cor:   'verde' },
        { sigla: 'PTN',    numero: 19, fundado: 1995,
          nome:  'Partido Trabalhista Nacional',
          cor:   'verde' },
        { sigla: 'PSDC',   numero: 27, fundado: 1995,
          nome:  'Partido Social Democrata Cristão',
          cor:   'azul' },
        { sigla: 'PTC',    numero: 36, fundado: 2000,
          nome:  'Partido Trabalhista Cristão',
          cor:   'azul' },
        { sigla: 'PHS',    numero: 31, fundado: 2000,
          nome:  'Partido Humanista da Solidariedade',
          cor:   'azul' },
        { sigla: 'PEN',    numero: 51, fundado: 2011,
          nome:  'Partido Ecológico Nacional',
          cor:   'verde' },
      ],
      fora_do_congresso: [
        { sigla: 'PTdoB',  numero: 70, fundado: 1989,
          nome:  'Partido Trabalhista do Brasil',
          cor:   'verde' },
        { sigla: 'PSTU',   numero: 16, fundado: 1993,
          nome:  'Partido Socialista dos Trabalhadores Unificado',
          cor:   'vermelho' },
        { sigla: 'PCB',    numero: 21, fundado: 1993,
          nome:  'Partido Comunista Brasileiro',
          cor:   'vermelho' },
        { sigla: 'PCO',    numero: 29, fundado: 1995,
          nome:  'Partido da Causa Operária',
          cor:   'vermelho' },
        { sigla: 'PPL',    numero: 54, fundado: 2009,
          nome:  'Partido Pátria Livre',
          cor:   'verde' },
      ],
      mudancas_de_nome: [
        { sigla: 'PJ',     numero: 36, fundado: 1985, extinto: 1989, renomeado: 'PRN',
          nome:  'Partido da Juventude',
          cor:   'azul' },
        { sigla: 'PNT',    numero: 67, fundado: 1990, extinto: 1991, renomeado: 'PNTB',
          nome:  'Partido Nacionalista dos Trabalhadores',
          cor:   'verde' },
        { sigla: 'PCB',    numero: 23, fundado: 1987, extinto: 1992, renomeado: 'PPS', naoEhUltimo: true,
          nome:  'Partido Comunista Brasileiro',
          cor:   'vermelho' },
        { sigla: 'PTR',    numero: 28, fundado: 1985, extinto: 1993, renomeado: 'PP',
          nome:  'Partido Trabalhista Renovador',
          cor:   'azul' },
        { sigla: 'PRT',    numero: 16, fundado: 1992, extinto: 1993, renomeado: 'PSTU',
          nome:  'Partido Revolucionário dos Trabalhadores',
          cor:   'vermelho' },
        { sigla: 'PTRB',   numero: 17, fundado: 1993, extinto: 1995, renomeado: 'PRTB',
          nome:  'Partido Trabalhista Renovador Brasileiro',
          cor:   'verde' },
        { sigla: 'PDC',    numero: 27, fundado: 1995, extinto: 1995, renomeado: 'PSDC',
          nome:  'Partido Democrata Cristão',
          cor:   'azul' },
        { sigla: 'PSN',    numero: 31, fundado: 1995, extinto: 1997, renomeado: 'PSN',
          nome:  'Partido Solidarista Nacional',
          cor:   'azul' },
        { sigla: 'PRN',    numero: 36, fundado: 1989, extinto: 2000, renomeado: 'PTC',
          nome:  'Partido da Reconstrução Nacional',
          cor:   'azul' },
        { sigla: 'PSN',    numero: 31, fundado: 1997, extinto: 2000, renomeado: 'PHS',
          nome:  'Partido da Solidariedade Nacional',
          cor:   'azul' },
        { sigla: 'PPB',    numero: 11, fundado: 1995, extinto: 2003, renomeado: 'PP',
          nome:  'Partido Progressista Brasileiro',
          cor:   'azul' },
        { sigla: 'PFL',    numero: 25, fundado: 1985, extinto: 2007, renomeado: 'DEM',
          nome:  'Partido da Frente Liberal',
          cor:   'azul claro' },
      ],
      incorporacoes: [
        { sigla: 'PASART', numero: 30, fundado: 1985, extinto: 1990, incorporado: 'PTdoB',
          nome:  'Partido Socialista Agrário Renovador Trabalhista',
          cor:   'azul claro' },
        { sigla: 'PCN',    numero: 31, fundado: 1988, extinto: 1992, incorporado: 'PDT',
          nome:  'Partido Comunitário Nacional',
          cor:   'vermelho' },
        { sigla: 'PNTB',   numero: 81, fundado: 1991, extinto: 1993, incorporado: 'PTdoB',
          nome:  'Partido Nacionalista dos Trabalhadores Brasileiros',
          cor:   'verde' },
        { sigla: 'PST',    numero: 52, fundado: 1989, extinto: 1993, incorporado: 'PTR', naoEhUltimo: true,
          nome:  'Partido Social Trabalhista',
          cor:   'azul' },
        { sigla: 'PSD',    numero: 41, fundado: 1987, extinto: 2003, incorporado: 'PTB', naoEhUltimo: true,
          nome:  'Partido Social Democrático',
          cor:   'laranja' },
        { sigla: 'PGT',    numero: 30, fundado: 1995, extinto: 2003, incorporado: 'PL',
          nome:  'Partido Geral dos Trabalhadores',
          cor:   'roxo' },
        { sigla: 'PST',    numero: 18, fundado: 1996, extinto: 2003, incorporado: 'PL',
          nome:  'Partido Social Trabalhista',
          cor:   'roxo' },
        { sigla: 'PAN',    numero: 26, fundado: 1998, extinto: 2006, incorporado: 'PTB',
          nome:  'Partido dos Aposentados da Nação',
          cor:   'laranja' },
      ],
      fusoes: [
        { sigla: 'PDS',    numero: 11, fundado: 1980, extinto: 1993, fusao: 'PPR',
          nome:  'Partido Democrático Social',
          cor:   'azul' },
        { sigla: 'PDC',    numero: 17, fundado: 1985, extinto: 1993, fusao: 'PPR',
          nome:  'Partido Democrata Cristão',
          cor:   'azul' },
        { sigla: 'PP',     numero: 39, fundado: 1993, extinto: 1995, fusao: 'PPB', naoEhUltimo: true,
          nome:  'Partido Progressista',
          cor:   'azul' },
        { sigla: 'PPR',    numero: 11, fundado: 1993, extinto: 1995, fusao: 'PPB',
          nome:  'Partido Progressista Reformador',
          cor:   'azul' },
        { sigla: 'PL',     numero: 22, fundado: 1985, extinto: 2006, fusao: 'PR',
          nome:  'Partido Liberal',
          cor:   'azul' },
        { sigla: 'PRONA',  numero: 56, fundado: 1989, extinto: 2006, fusao: 'PR',
          nome:  'Partido de Reedificação da Ordem Nacional',
          cor:   'azul' },
      ],
      extintos: [
        { sigla: 'PMB',    numero: 26, fundado: 1985, extinto: 1989,
          nome:  'Partido Municipalista Brasileiro',
          cor:   'verde' },
        { sigla: 'PTN',    numero: 21, fundado: 1986, extinto: 1986, naoEhUltimo: true,
          nome:  'Partido Trabalhista Nacional',
          cor:   'laranja' },
        { sigla: 'PSL',    numero: 59, fundado: 1989, extinto: 1992, naoEhUltimo: true,
          nome:  'Partido do Solidarismo Libertador',
          cor:   'azul' },
        { sigla: 'PRS',    numero: 71, fundado: 1990, extinto: 1992,
          nome:  'Partido das Reformas Sociais',
          cor:   'roxo' },
      ],
    };

    Configuracao.partidos = _.flatten(_.values(Configuracao.partidosEmGrupos));

    Configuracao.top10 = {
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
        { de: { sigla: 'PDS',    numero: 11 }, para: 'ARENA (1965)' },
        { de: { sigla: 'PPR',    numero: 11 }, para: 'ARENA (1965)' },
        { de: { sigla: 'PPB',    numero: 11 }, para: 'ARENA (1965)' },
        { de: { sigla: 'PP',     numero: 11 }, para: 'ARENA (1965)' },
        { de: { sigla: 'PFL',    numero: 25 }, para: 'ARENA (1965)' },
        { de: { sigla: 'DEM',    numero: 25 }, para: 'ARENA (1965)' },
        { de: { sigla: 'PSD',    numero: 55 }, para: 'ARENA (1965)' },
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

    Configuracao.prototype.cor = function(info) {

      var chave = info.sigla + info.numero.toString() + (info.extinto ? info.extinto.toString() : '');

      // Se for primeira vez, acha a cor do partido
      if (!(chave in this._coresDosPartidos)) {

        // Inicia um novo loop nas variantes da cor
        if (this._pilhaDeCores[info.cor].length === 0) {
          this._pilhaDeCores[info.cor] = Configuracao.cores[info.cor].slice();
        }

        // Pega uma variante da cor do partido
        this._coresDosPartidos[chave] = this._pilhaDeCores[info.cor].shift();

      }

      return this._coresDosPartidos[chave];
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

        var todasAsLinhas = _.flatten(_.pluck(partidos, 'indices'));

        var linhasPorAno = _.values(_.groupBy(todasAsLinhas, function(linha) { return linha.ano; }));

        var somasDosIndicesPorAno = _.map(linhasPorAno, function(linhas) {
          return { ano: linhas[0].ano, indice: _.sum(linhas, 'indice') };
        });

        return mapFunction(partidos, somasDosIndicesPorAno);

      });

    };

    Configuracao.prototype.mesclarPartidosExtintos = function(dados) {

      var _this = this;
      var migrouUmPartido = false;

      // Realiza migrações
      var migrados = _.flatten(_.map(dados, function(partido) {

        var infoDestino = partido.info;

        // Apenas partidos extintos podem ser migrados
        if (partido.info.extinto != null) {

          var mesclarCom = null;
          if (_this.mudancasDeNome === true && partido.info.renomeado != null) {
            mesclarCom = partido.info.renomeado;
          } else if (_this.incorporacoes === true && partido.info.incorporado != null) {
            mesclarCom = partido.info.incorporado;
          } else if (_this.fusoes === true && partido.info.fusao != null) {
            mesclarCom = partido.info.fusao;
          }

          if (mesclarCom != null) {

            migrouUmPartido = true;

            infoDestino = _.find(Configuracao.partidos, function(infoDestino) {
              return (
                (mesclarCom === infoDestino.sigla) &&
                (infoDestino.extinto      == null                                || infoDestino.extinto >= partido.info.extinto) &&
                (partido.info.incorporado == null                                || infoDestino.fundado <= partido.info.extinto) &&
                ((partido.info.renomeado  == null && partido.info.fusao == null) || infoDestino.fundado >= partido.info.extinto));
            });

          }

        }

        return {
          sigla:     infoDestino.sigla,
          numero:    infoDestino.numero,
          fundado:   partido.fundado || partido.info.fundado,
          extinto:   infoDestino.extinto,
          indices:   partido.indices,
          info:      infoDestino,
          mesclados: infoDestino === partido.info ? (partido.mesclados || []) : (partido.mesclados || []).concat([ partido.info ])
        };

      }));

      if (migrouUmPartido === true) {

        // Agrupa repetidos
        var porPartido = _.values(_.groupBy(migrados, function(partido) {
          return partido.sigla + partido.numero + (partido.extinto || '')
        }));

        // Soma índices
        var mesclados = somarIndicesDosRepetidos(porPartido, function(lista, somas) {
          return {
            sigla:     lista[0].sigla,
            numero:    lista[0].numero,
            fundado:   _.min(lista, function(p) { return p.fundado }).fundado,
            extinto:   lista[0].extinto,
            indices:   somas,
            info:      lista[0].info,
            mesclados: lista[0].mesclados
          };
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

          return { sigla: sigla, indices: partido.indices, info: partido.info, mesclados: partido.mesclados };

        });

      } else {

        // Realiza migrações
        var migrados = _.map(dados, function(partido) {
          var config = _.find(_this.tabelaDeReescrita.mapear, function(config) {
            return partido.sigla  === config.de.sigla &&
                   partido.numero === config.de.numero;
          });
          return {
            sigla:     config != null ? config.para : _this.tabelaDeReescrita.resto,
            indices:   partido.indices,
            info:      partido.info,
            mesclados: partido.mesclados
          };
        });

        // Agrupa repetidos
        var porSigla = _.groupBy(migrados, function(partido) {
          return partido.sigla;
        });

        // Soma índices
        var mesclados = somarIndicesDosRepetidos(_.values(porSigla), function(lista, somas) {
          var sigla           = lista[0].sigla;
          var info, mesclados;
          if (sigla !== _this.tabelaDeReescrita.resto) {
            var primeiroMapeado = _.find(_this.tabelaDeReescrita.mapear, function(config) { return config.para === sigla; });
            var info            = _.find(Configuracao.partidos, function(p) { return p.sigla === primeiroMapeado.de.sigla && p.numero === primeiroMapeado.de.numero; });
            var mesclados       = _.filter(_.map(lista, function(p) { return p.info; }), function(p) { return p !== info; });
          }
          return { sigla: lista[0].sigla, indices: somas, info: info, mesclados: mesclados };
        });

        return mesclados;

      }

    };

    return Configuracao;

  })();

})(_);
