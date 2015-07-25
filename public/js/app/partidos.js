/* globals ipl, _ */
/* exported ipl.RepositorioDePartidos */

;(function(ipl, _) {
  'use strict';

  /**
   * Um objeto com as informações de um partido.
   *
   * @typedef {Object} ipl.Partido
   * @property {string} sigla
   * @property {number} numero
   * @property {ipl.Ano} fundado
   * @property {?ipl.Ano} extinto
   * @property {?boolean} naoEhUtilmo
   * @property {?string} renomeado
   * @property {?string} incorporado
   * @property {?string} fusao
   * @property {string} nome
   * @property {string} cor
   */

  var partidosEmGrupos = {
    grandes: [
      { sigla: 'PMDB',   numero: 15, fundado: 1979,
        nome:  'Partido do Movimento Democrático Brasileiro',
        cor:   'verde' },
      { sigla: 'PT',     numero: 13, fundado: 1979,
        nome:  'Partido dos Trabalhadores',
        cor:   'vermelho' },
      { sigla: 'PSDB',   numero: 45, fundado: 1988,
        nome:  'Partido da Social Democracia Brasileira',
        cor:   'azul' }
    ],
    medios: [
      { sigla: 'PTB',    numero: 14, fundado: 1979,
        nome:  'Partido Trabalhista Brasileiro',
        cor:   'laranja' },
      { sigla: 'PDT',    numero: 12, fundado: 1979,
        nome:  'Partido Democrático Trabalhista',
        cor:   'vermelho' },
      { sigla: 'PSB',    numero: 40, fundado: 1986,
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
        cor:   'verde' }
    ],
    pequenos: [
      { sigla: 'PSC',    numero: 20, fundado: 1985,
        nome:  'Partido Social Cristão',
        cor:   'verde' },
      { sigla: 'PCdoB',  numero: 65, fundado: 1986,
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
        cor:   'laranja' }
    ],
    nanicos: [
      { sigla: 'PMN',    numero: 33, fundado: 1986,
        nome:  'Partido da Mobilização Nacional',
        cor:   'vermelho' },
      { sigla: 'PRP',    numero: 44, fundado: 1989,
        nome:  'Partido Republicano Progressista',
        cor:   'azul' },
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
        cor:   'azul claro' },
      { sigla: 'PTC',    numero: 36, fundado: 2000,
        nome:  'Partido Trabalhista Cristão',
        cor:   'azul claro' },
      { sigla: 'PHS',    numero: 31, fundado: 2000,
        nome:  'Partido Humanista da Solidariedade',
        cor:   'azul' },
      { sigla: 'PEN',    numero: 51, fundado: 2011,
        nome:  'Partido Ecológico Nacional',
        cor:   'verde' }
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
        cor:   'verde' }
    ],
    mudancas_de_nome: [
      { sigla: 'PJ',     numero: 36, fundado: 1985,
        extinto: 1989, renomeado: 'PRN',
        nome:  'Partido da Juventude',
        cor:   'azul' },
      { sigla: 'PNT',    numero: 67, fundado: 1990,
        extinto: 1991, renomeado: 'PNTB',
        nome:  'Partido Nacionalista dos Trabalhadores',
        cor:   'verde' },
      { sigla: 'PCB',    numero: 23, fundado: 1986,
        extinto: 1992, renomeado: 'PPS', naoEhUltimo: true,
        nome:  'Partido Comunista Brasileiro',
        cor:   'vermelho' },
      { sigla: 'PTR',    numero: 28, fundado: 1985,
        extinto: 1993, renomeado: 'PP',
        nome:  'Partido Trabalhista Renovador',
        cor:   'azul' },
      { sigla: 'PRT',    numero: 16, fundado: 1992,
        extinto: 1993, renomeado: 'PSTU',
        nome:  'Partido Revolucionário dos Trabalhadores',
        cor:   'vermelho' },
      { sigla: 'PTRB',   numero: 17, fundado: 1993,
        extinto: 1995, renomeado: 'PRTB',
        nome:  'Partido Trabalhista Renovador Brasileiro',
        cor:   'verde' },
      { sigla: 'PDC',    numero: 27, fundado: 1995,
        extinto: 1995, renomeado: 'PSDC',
        nome:  'Partido Democrata Cristão',
        cor:   'azul' },
      { sigla: 'PSN',    numero: 31, fundado: 1995,
        extinto: 1997, renomeado: 'PSN',
        nome:  'Partido Solidarista Nacional',
        cor:   'azul' },
      { sigla: 'PRN',    numero: 36, fundado: 1989,
        extinto: 2000, renomeado: 'PTC',
        nome:  'Partido da Reconstrução Nacional',
        cor:   'azul claro' },
      { sigla: 'PSN',    numero: 31, fundado: 1997,
        extinto: 2000, renomeado: 'PHS',
        nome:  'Partido da Solidariedade Nacional',
        cor:   'azul' },
      { sigla: 'PPB',    numero: 11, fundado: 1995,
        extinto: 2003, renomeado: 'PP',
        nome:  'Partido Progressista Brasileiro',
        cor:   'azul' },
      { sigla: 'PFL',    numero: 25, fundado: 1985,
        extinto: 2007, renomeado: 'DEM',
        nome:  'Partido da Frente Liberal',
        cor:   'azul claro' }
    ],
    incorporacoes: [
      { sigla: 'PASART', numero: 30, fundado: 1985,
        extinto: 1990, incorporado: 'PTdoB',
        nome:  'Partido Socialista Agrário Renovador Trabalhista',
        cor:   'azul claro' },
      { sigla: 'PCN',    numero: 31, fundado: 1988,
        extinto: 1992, incorporado: 'PDT',
        nome:  'Partido Comunitário Nacional',
        cor:   'vermelho' },
      { sigla: 'PNTB',   numero: 81, fundado: 1991,
        extinto: 1993, incorporado: 'PTdoB',
        nome:  'Partido Nacionalista dos Trabalhadores Brasileiros',
        cor:   'verde' },
      { sigla: 'PST',    numero: 52, fundado: 1989,
        extinto: 1993, incorporado: 'PTR', naoEhUltimo: true,
        nome:  'Partido Social Trabalhista',
        cor:   'azul' },
      { sigla: 'PSD',    numero: 41, fundado: 1987,
        extinto: 2003, incorporado: 'PTB', naoEhUltimo: true,
        nome:  'Partido Social Democrático',
        cor:   'laranja' },
      { sigla: 'PGT',    numero: 30, fundado: 1995,
        extinto: 2003, incorporado: 'PL',
        nome:  'Partido Geral dos Trabalhadores',
        cor:   'roxo' },
      { sigla: 'PST',    numero: 18, fundado: 1996,
        extinto: 2003, incorporado: 'PL',
        nome:  'Partido Social Trabalhista',
        cor:   'roxo' },
      { sigla: 'PAN',    numero: 26, fundado: 1998,
        extinto: 2006, incorporado: 'PTB',
        nome:  'Partido dos Aposentados da Nação',
        cor:   'laranja' }
    ],
    fusoes: [
      { sigla: 'PDS',    numero: 11, fundado: 1980,
        extinto: 1993, fusao: 'PPR',
        nome:  'Partido Democrático Social',
        cor:   'azul' },
      { sigla: 'PDC',    numero: 17, fundado: 1985,
        extinto: 1993, fusao: 'PPR',
        nome:  'Partido Democrata Cristão',
        cor:   'azul' },
      { sigla: 'PP',     numero: 39, fundado: 1993,
        extinto: 1995, fusao: 'PPB', naoEhUltimo: true,
        nome:  'Partido Progressista',
        cor:   'azul' },
      { sigla: 'PPR',    numero: 11, fundado: 1993,
        extinto: 1995, fusao: 'PPB',
        nome:  'Partido Progressista Reformador',
        cor:   'azul' },
      { sigla: 'PL',     numero: 22, fundado: 1985,
        extinto: 2006, fusao: 'PR',
        nome:  'Partido Liberal',
        cor:   'azul' },
      { sigla: 'PRONA',  numero: 56, fundado: 1989,
        extinto: 2006, fusao: 'PR',
        nome:  'Partido de Reedificação da Ordem Nacional',
        cor:   'azul' }
    ],
    extintos: [
      { sigla: 'PMB',    numero: 26, fundado: 1985,
        extinto: 1989,
        nome:  'Partido Municipalista Brasileiro',
        cor:   'verde' },
      { sigla: 'PTN',    numero: 21, fundado: 1986,
        extinto: 1986, naoEhUltimo: true,
        nome:  'Partido Trabalhista Nacional',
        cor:   'laranja' },
      { sigla: 'PSL',    numero: 59, fundado: 1989,
        extinto: 1992, naoEhUltimo: true,
        nome:  'Partido do Solidarismo Libertador',
        cor:   'azul' },
      { sigla: 'PRS',    numero: 71, fundado: 1990,
        extinto: 1992,
        nome:  'Partido das Reformas Sociais',
        cor:   'roxo' }
    ]
  };

  /**
   * @classdesc Classe para pesquisa de dados dos partidos.
   *
   * @alias ipl.RepositorioDePartidos
   * @constructor
   * @param {?Array<ipl.Partido>} partidos - {@link RepositorioDePartidos#partidos}
   */
  function RepositorioDePartidos(partidos) {
    /**
     * Lista de partidos.
     * @member {Array<ipl.Partido>} ipl.RepositorioDePartidos~partidos
     */
    this.partidos = partidos || RepositorioDePartidos.PARTIDOS;
    /**
     * Cache para memoizar o resultado de algumas funções.
     * @member {ipl.Cache} ipl.RepositorioDePartidos~cache
     */
    this.cache = new ipl.Cache();
  }

  /** @const {Array<ipl.Partido>} ipl.RepositorioDePartidos.PARTIDOS */
  RepositorioDePartidos.PARTIDOS = _.flatten(_.values(partidosEmGrupos));

  RepositorioDePartidos.prototype = {

    /**
     * Retorna todos os partidos.
     *
     * @returns {Array<ipl.Partido>}
     * @nosideeffects
     */
    todos: function() {
      return this.partidos;
    },

    /**
     * Busca um partido.
     *
     * @param {{sigla: string, numero: number}} filtro
     * @returns {ipl.Partido}
     * @nosideeffects
     */
    buscar: function(filtro) {
      var partido = _.find(this.partidos, filtro);
      if (partido == null) {
        throw 'Partido ' + JSON.stringify(filtro) + ' não encontrado!';
      }
      return partido;
    },

    /**
     * Busca o partido em que outro foi incorporado, fundido ou renomeado.
     *
     * @param {ipl.Partido} partido - Partido extinto.
     * @returns {ipl.Partido} Partido sucessor.
     * @nosideeffects
     */
    buscarSucessor: function(partido) {
      var chave = 'buscarSucessor' + partido.sigla + partido.numero + partido.fundado;
      if (!this.cache.has(chave)) {
        // Partidos com o nome correto e fundados após a extinção desse
        // Ex.: PTR -> [ PP (1993), PP (2003) ]
        var possiveisSucessores = _.filter(this.partidos, function(sucessor) {
          return (
            // Se o sucessor foi extinto, não pode ter sido extinto antes do predecessor
            (sucessor.extinto == null || sucessor.extinto >= partido.extinto) &&
            // Se foi incorporado, o sucessor deve existir desde **antes** da incorporação
            ((partido.incorporado === sucessor.sigla &&
              sucessor.fundado <= partido.extinto) ||
            // Se foi renomeado, o sucessor foi criado **após** a mudança de nome
             (partido.renomeado   === sucessor.sigla &&
              sucessor.fundado >= partido.extinto) ||
            // Se foi fundido, o sucessor foi criado **após** a fusão
             (partido.fusao       === sucessor.sigla &&
              sucessor.fundado >= partido.extinto)));
        });
        // Primeiro partido fundado após a extinção do outro
        // Ex.: PTR -> PP (1993) ao invés de PP (2003)
        var sucessor = _.min(possiveisSucessores, 'fundado');
        this.cache.set(chave, sucessor);
        return sucessor;
      }
      return this.cache.get(chave);
    }

  };

  ipl.RepositorioDePartidos = RepositorioDePartidos;

})(ipl, _);
