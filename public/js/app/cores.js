/* globals ipl */
/* exported ipl.GerenciadorDeCores */

;(function(ipl) {
  'use strict';

  /**
   * Cor do partido.
   * @typedef {string} ipl.Cor
   */

  /**
   * Tom exato usando por um partido na série.
   * @typedef {string} ipl.Tom
   */

  /**
   * @classdesc Gerencia cores das séries para cada partido.
   *
   * @alias ipl.GerenciadorDeCores
   * @constructor
   * @param {ipl.RepositorioDePartidos} partidos - {@link ipl.GerenciadorDeCores~partidos}
   * @param {Object<ipl.Cor,Array<ipl.Tom>>}
   *   [cores={@link ipl.GerenciadorDeCores.CORES_PADRAO}]
   *   {@link ipl.GerenciadorDeCores~cores}
   */
  function GerenciadorDeCores(partidos, cores) {
    /**
     * Repositório de partidos.
     * @member {ipl.RepositorioDePartidos} ipl.GerenciadorDeCores#partidos
     */
    this.partidos = partidos;
    /**
     * Paleta de tons disponíveis para cada cor.
     * @member {Object<ipl.Cor,Array<ipl.Tom>>} ipl.GerenciadorDeCores~cores
     */
    this.cores = cores || GerenciadorDeCores.CORES_PADRAO;
    /**
     * Tons não utilizados para cada cor, a pilha é reiniciada da paleta toda vez que esvazia.
     * @member {Object<ipl.Cor,Array<ipl.Tom>>} ipl.GerenciadorDeCores~pilhasDeCores
     */
    this.pilhasDeCores = {};
    /**
     * Cache de cores dos partidos.
     * @member {ipl.Cache} ipl.GerenciadorDeCores~cache
     */
    this.cache = new ipl.Cache();
  }

  /** @const {Object<ipl.Cor,Array<ipl.Tom>>} ipl.GerenciadorDeCores.CORES_PADRAO */
  GerenciadorDeCores.CORES_PADRAO = {
    verde:        [ 'green' ],
    vermelho:     [ 'red' ],
    laranja:      [ 'orange' ],
    azul:         [ 'blue' ],
    'azul claro': [ 'lightblue' ],
    roxo:         [ 'purple' ]
  };

  GerenciadorDeCores.prototype = {

    /**
     * Retorna próxima tom da pilha.
     *
     * @method ipl.GerenciadorDeCores~proxima
     * @param {ipl.Cor} cor
     * @returns {ipl.Tom}
     */
    proxima: function(cor) {
      // Inicia uma nova pilha de cores
      if (!(cor in this.pilhasDeCores)) {
        this.pilhasDeCores[cor] = [];
      }

      // Inicia um novo loop nas variantes da cor
      if (this.pilhasDeCores[cor].length === 0) {
        this.pilhasDeCores[cor] = this.cores[cor].slice();
      }

      // Pega uma variante da cor do partido
      return this.pilhasDeCores[cor].shift();
    },

    /**
     * Retorna tom atribuído para o partido.
     *
     * @method ipl.GerenciadorDeCores#cor
     * @param {ipl.Partido} partido
     * @returns {ipl.Tom}
     */
    cor: function(partido) {
      var chave = partido.sigla + partido.numero + partido.fundado;
      if (!this.cache.has(chave)) {
        // Se o partido foi renomeado, usa a mesma cor do sucessor
        if (partido.renomeado != null) {
          var sucessor = this.partidos.buscarSucessor(partido);
          var corDoSucessor = this.cor(sucessor);
          this.cache.set(chave, corDoSucessor);
          return corDoSucessor;
        }
        // Retorna próxima cor da paleta
        var proximaCor = this.proxima(partido.cor);
        this.cache.set(chave, proximaCor);
        return proximaCor;
      }
      return this.cache.get(chave);
    }

  };

  ipl.GerenciadorDeCores = GerenciadorDeCores;

})(ipl);
