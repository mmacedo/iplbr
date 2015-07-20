(function(_, ipl) {
  'use strict';

  /**
   * Interface para um objeto que retorna os dados de um índice.
   *
   * @interface Indice
   */

  /**
   * Retornar anos que tem dados para esse índice.
   *
   * @method Indice#anos
   * @param {Regiao} regiao
   * @returns {number}
   */

  /**
   * Retornar se tem dados suficientes no ano para calcular o índice.
   *
   * @method Indice#temDados
   * @param {Regiao} regiao
   * @param {Ano}    ano
   * @returns {boolean}
   */

  /**
   * Retornar todas as séries que tem dados para esse índice.
   *
   * @method Indice#series
   * @param {Regiao} regiao
   * @param {Ano}    ano
   * @returns {number}
   */

  /**
   * Retornar índice no ano para a série.
   *
   * @method Indice#calcula
   * @param {Regiao}    regiao
   * @param {Ano}       ano
   * @param {IdPartido} idPartido
   * @returns {number}
   */

  /**
   * @classdesc
   * Classe para construção de índices.
   *
   * @constructor
   * @param {RepositorioEleitoral} repo - {@link FabricaDeIndices~repo}
   */
  function FabricaDeIndices(repo) {
    /**
     * Repositório de dados das eleições.
     *
     * @memberOf FabricaDeIndices.prototype
     * @member {RepositorioEleitoral}
     * @private
     */
    this.repo = repo;
    /**
     * Cache de singletons.
     *
     * @memberOf FabricaDeIndices.prototype
     * @member {ipl.Cache}
     * @private
     */
    this.singletons = new ipl.Cache();
  }

  FabricaDeIndices.prototype = {};

  _.extend(ipl, /** @lends ipl */ {
    FabricaDeIndices: FabricaDeIndices
  });

}.call(this, _, ipl));
