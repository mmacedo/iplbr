/* globals ipl, _ */
/* exported ipl.ConfiguracaoDePartidos */

;(function(ipl, _) {
  'use strict';

  /**
   * @callback ipl.TextoLocalizado
   * @returns {string}
   */

  /**
   * Tabela para criar séries personalizadas com os partidos.
   *
   * @typedef {Object} ipl.TabelaDeReescrita
   * @property {Array<{sigla:string, numero:number}>} mapear
   * @property {ipl.TextoLocalizado} resto
   */

  /**
   * Série (formato com dados produzidos pela mesclagem).
   *
   * @typedef ipl.SerieMesclada
   * @property {string} nome
   * @property {ipl.Ano} fundado
   * @property {?ipl.Ano} extinto
   * @property {ipl.Partido} info
   * @property {Array<ipl.PontoDaSerie>} indices
   * @property {Array<ipl.Partido>} mesclados
   */

  /**
   * @classdesc Configura os partidos que irão compor as séries.
   *
   * @alias ipl.ConfiguracaoDePartidos
   * @constructor
   * @param {ipl.RepositorioDePartidos} partidos - {@link ipl.ConfiguracaoDePartidos~partidos}
   */
  function ConfiguracaoDePartidos(partidos) {
    /**
     * Repositório de partidos.
     * @member {ipl.RepositorioDePartidos} ipl.ConfiguracaoDePartidos~partidos
     */
    this.partidos = partidos;
    /**
     * Habilita a mesclagem de partidos que mudaram de nome.
     * @member {bolean} ipl.ConfiguracaoDePartidos#mudancasDeNome
     * @default
     */
    this.mudancasDeNome = true;
    /**
     * Habilita a mesclagem de partidos que foram incorporados com seus sucessores.
     * @member {bolean} ipl.ConfiguracaoDePartidos#incorporacoes
     * @default
     */
    this.incorporacoes = false;
    /**
     * Habilita a mesclagem de partidos que foram fundidos com seus sucessores.
     * @member {bolean} ipl.ConfiguracaoDePartidos#fusoes
     * @default
     */
    this.fusoes = false;
    /**
     * Habilita a mesclagem de partidos que mudaram de nome com seus sucessores.
     * @member {ipl.TabelaDeReescrita} ipl.ConfiguracaoDePartidos#tabelaDeReescrita
     * @default
     */
    this.tabelaDeReescrita = null;
  }

  /** @member {string} ipl.ConfiguracaoDePartidos.restoPadrao */
  ConfiguracaoDePartidos.restoPadrao = 'Outros';

  /** @const {ipl.TabelaDeReescrita} ipl.ConfiguracaoDePartidos.top10 */
  ConfiguracaoDePartidos.top10 = {
    mapear: [
      { de: { sigla: 'PT',    numero: 13 }, para: 'PT' },
      { de: { sigla: 'PMDB',  numero: 15 }, para: 'PMDB' },
      { de: { sigla: 'PSDB',  numero: 45 }, para: 'PSDB' },
      { de: { sigla: 'PSB',   numero: 40 }, para: 'PSB' },
      { de: { sigla: 'PFL',   numero: 25 }, para: 'DEM' },
      { de: { sigla: 'DEM',   numero: 25 }, para: 'DEM' },
      { de: { sigla: 'PDS',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PDC',   numero: 17 }, para: 'PP' },
      { de: { sigla: 'PTR',   numero: 28 }, para: 'PP' },
      { de: { sigla: 'PST',   numero: 52 }, para: 'PP' },
      { de: { sigla: 'PP',    numero: 39 }, para: 'PP' },
      { de: { sigla: 'PPR',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PPB',   numero: 11 }, para: 'PP' },
      { de: { sigla: 'PP',    numero: 11 }, para: 'PP' },
      { de: { sigla: 'PL',    numero: 22 }, para: 'PR' },
      { de: { sigla: 'PRONA', numero: 56 }, para: 'PR' },
      { de: { sigla: 'PR',    numero: 22 }, para: 'PR' },
      { de: { sigla: 'PDT',   numero: 12 }, para: 'PDT' },
      { de: { sigla: 'PTB',   numero: 14 }, para: 'PTB' },
      { de: { sigla: 'PSD',   numero: 41 }, para: 'PTB' },
      { de: { sigla: 'PAN',   numero: 26 }, para: 'PTB' },
      { de: { sigla: 'PSD',   numero: 55 }, para: 'PSD' }
    ],
    resto: function() { return ConfiguracaoDePartidos.restoPadrao; }
  };

  /** @const {ipl.TabelaDeReescrita} ipl.ConfiguracaoDePartidos.top3 */
  ConfiguracaoDePartidos.top3 = {
    mapear: [
      { de: { sigla: 'PT',   numero: 13 }, para: 'PT' },
      { de: { sigla: 'PMDB', numero: 15 }, para: 'PMDB' },
      { de: { sigla: 'PSDB', numero: 45 }, para: 'PSDB' }
    ],
    resto: function() { return ConfiguracaoDePartidos.restoPadrao; }
  };

  /** @const {ipl.TabelaDeReescrita} ipl.ConfiguracaoDePartidos.antigos */
  ConfiguracaoDePartidos.antigos = {
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
    resto: function() { return ConfiguracaoDePartidos.restoPadrao; }
  };

  /**
   * @callback ipl.somaIndicesCallback
   * @param {Array<ipl.SerieMesclada>} conjuntoDePartidos
   * @param {Array<ipl.PontoDaSerie>} somasDosIndices
   * @inner
   */
  /**
   * Agrupa cada conjunto de partido somando índices e aplicando função.
   *
   * @function ipl.somaIndices
   * @param {Array<ipl.SerieMesclada>} conjuntosDePartidos - Lista de partidos para mesclar.
   * @param {ipl.somaIndicesCallback} callback - Retorna um único partido mesclado.
   * @param {Object} [thisArg] - Objeto this no callback.
   * @inner
   */
  function somaIndices(conjuntosDePartidos, callback, thisArg) {
    return _.map(conjuntosDePartidos, function(conjunto) {
      if (conjunto.length === 1) {
        return conjunto[0];
      }
      var todosOsIndices = _.flatten(_.pluck(conjunto, 'indices'));
      var indicesPorAno = _.values(_.groupBy(todosOsIndices, 'ano'));
      var somasDosIndicesPorAno = _.map(indicesPorAno, function(indices) {
        return { ano: indices[0].ano, indice: _.sum(indices, 'indice') };
      });
      return callback.call(thisArg, conjunto, somasDosIndicesPorAno);
    });
  }

  ConfiguracaoDePartidos.prototype = {

    /**
     * Mescla partidos extintos com seus sucessores de acordo com a configuração.
     *
     * @method ipl.ConfiguracaoDePartidos~mesclaPartidosExtintos
     * @param {Array<ipl.SerieMesclada>} partidos
     * @returns {Array<ipl.SerieMesclada>}
     */
    mesclaPartidosExtintos: function(partidos) {
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

        var sucessor = this.partidos.buscaSucessor(partido.info);

        return {
          nome:      sucessor.sigla,
          fundado:   partido.fundado,
          extinto:   sucessor.extinto,
          info:      sucessor,
          indices:   partido.indices,
          mesclados: partido.mesclados.concat([ partido.info ])
        };

      }, this);

      if (migrouUmPartido === true) {

        // Agrupa repetidos
        var porPartido = _.values(_.groupBy(processados, function(partido) {
          return partido.nome + (partido.extinto || '');
        }));

        // Soma índices
        var mesclados = somaIndices(porPartido, function(lista, somas) {
          var p = lista[0];
          return {
            nome:      p.nome,
            fundado:   _.min(lista, 'fundado').fundado,
            extinto:   p.extinto,
            info:      p.info,
            indices:   somas,
            mesclados: p.mesclados
          };
        });

        // Reaplica migrações nos novos dados
        return this.mesclaPartidosExtintos(mesclados);

      }

      return processados;
    },

    /**
     * Desambígua siglas repetidas.
     * @example
     * // [ { nome: 'PSD' }, { nome: 'PSD (1987)' } ]
     * desambiguaSiglas([
     *   { nome: 'PSD', fundado: 2011 },
     *   { nome: 'PSD', fundado: 1987 }
     * ])
     * @method ipl.ConfiguracaoDePartidos~desambiguaSiglas
     * @param {Array<ipl.SerieMesclada>} partidos
     * @returns {Array<ipl.SerieMesclada>}
     */
    desambiguaSiglas: function(partidos) {
      return _.map(partidos, function(p) {
        // Adiciona data de fundação se tem partido mais recente com a mesma sigla
        var siglaDesambiguada = p.info.naoEhUltimo === true ?
          (p.info.sigla + ' (' + p.info.fundado.toString() + ')') :
          p.info.sigla;
        return _.assign({}, p, { nome: siglaDesambiguada });
      });
    },

    /**
     * Agrupa partidos de acordo com a tabela de reescrita configurada.
     *
     * @method ipl.ConfiguracaoDePartidos~agrupaPartidos
     * @param {Array<ipl.SerieMesclada>} partidos
     * @returns {Array<ipl.SerieMesclada>}
     */
    agrupaPartidos: function(partidos) {

      // Encontra novas siglas
      var migrados = _.map(partidos, function(p) {
        var de = { de: _.pick(p.info, [ 'sigla', 'numero' ]) };
        var config = _.find(this.tabelaDeReescrita.mapear, de);
        return _.assign({}, p, {
          nome: config != null ?
            config.para :
            this.tabelaDeReescrita.resto()
        });
      }, this);

      // Agrupa repetidos
      var porNome = _.values(_.groupBy(migrados, 'nome'));

      // Soma índices
      var mesclados = somaIndices(porNome, function(partidos, somas) {
        var nome = partidos[0].nome;

        var todosMesclados = _.flatten(_.map(partidos, function(p) {
          return [ p.info ].concat(p.mesclados);
        }));

        var info = null, mesclados = todosMesclados;
        if (nome !== this.tabelaDeReescrita.resto()) {
          info = this.partidos.busca(_.find(this.tabelaDeReescrita.mapear, 'para', nome).de);
          mesclados = _.without(mesclados, info);
        }

        return {
          nome:      nome,
          fundado:   _.min(partidos, 'fundado').fundado,
          extinto:   _.all(partidos, 'extinto') ? _.max(partidos, 'extinto').extinto : null,
          info:      info,
          indices:   somas,
          mesclados: mesclados
        };
      }, this);

      return mesclados;

    },

    /**
     * Aplica configuração reescrevendo siglas e agrupando partidos somando os índices.
     *
     * @method ipl.ConfiguracaoDePartidos#mapeiaPartidos
     * @param {Array<ipl.Serie>} partidos
     * @returns {Array<ipl.SerieMesclada>}
     */
    mapeiaPartidos: function(seriesNaoMescladas) {
      var series = _.map(seriesNaoMescladas, function(serie) {
        serie.mesclados = [];
        return serie;
      });
      series = this.mesclaPartidosExtintos(series);
      if (this.tabelaDeReescrita == null) {
        return this.desambiguaSiglas(series);
      } else {
        return this.agrupaPartidos(series);
      }
    }

  };

  ipl.ConfiguracaoDePartidos = ConfiguracaoDePartidos;

})(ipl, _);
