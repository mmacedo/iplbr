(function(_, ipl) {
  'use strict';

  /**
   * Um objeto de parâmetro para filtrar as UEs para calcular o índice.
   *
   * @typedef {Object} Regiao
   * @property {Array<Ue>} ues - Lista de UEs da região.
   * @property {string} nome   - Nome da região.
   */

  /**
   * Interface para um objeto que calcula quantidades e pesos para cada componente
   * do índice.
   *
   * @interface Resultado
   */

  /**
   * Retornar quantidade do componente no ano para a série.
   *
   * @method Resultado#quantidade
   * @param {TipoDeEleicao} tipoDeEleicao
   * @param {Ano} ano
   * @param {IdPartido} serie
   * @returns {number}
   */

  /**
   * Retornar soma do componente no ano para todas as séries.
   *
   * @method Resultado#total
   * @param {TipoDeEleicao} tipoDeEleicao
   * @param {Ano} ano
   * @returns {number}
   */

  /**
   * Retornar o peso do componente em relação a todos os componentes no ano.
   *
   * @method Resultado#peso
   * @param {TipoDeEleicao} tipoDeEleicao
   * @param {Ano} ano
   * @returns {number}
   */

  /**
   * @classdesc
   * Resultados das eleições com valores nominais (sem peso).
   *
   * @constructor
   * @param {RepositorioEleitoral} repo - {@link ResultadoSemPeso~repo}
   * @implements {Resultado}
   */
  function ResultadoSemPeso(repo) {
    /**
     * Fonte de dados eleitorais.
     *
     * @memberOf ResultadoSemPeso.prototype
     * @member {RepositorioEleitoral}
     * @protected
     */
    this.repo = repo;
  }

  ResultadoSemPeso.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    quantidade: function(tipoDeEleicao, ano, partido) {
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.quantidade(tipoDeEleicao, eleicao, partido);
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    total: function(tipoDeEleicao, ano) {
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return _.sum(mandatos, function(eleicao) {
        return this.repo.total(tipoDeEleicao, eleicao);
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    peso: function(tipoDeEleicao, ano) {
      return this.total(tipoDeEleicao, ano);
    }

  };

  /**
   * @classdesc
   * Resultados das eleições com valores proporcionais à população da UE representada.
   *
   * @constructor
   * @param {RepositorioEleitoral} repo - {@link ResultadoPorPopulacao~repo}
   * @implements {Resultado}
   */
  function ResultadoPorPopulacao(repo) {
    /**
     * Fonte de dados eleitorais.
     *
     * @memberOf ResultadoPorPopulacao.prototype
     * @member {RepositorioEleitoral}
     * @protected
     */
    this.repo = repo;
  }

  ResultadoPorPopulacao.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    quantidade: function(tipoDeEleicao, ano, partido) {
      var populacaoDoAno = this.repo.populacao(tipoDeEleicao.ue, ano);
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      var total = _.sum(mandatos, function(eleicao) {
        return this.repo.total(tipoDeEleicao, eleicao);
      }, this);
      return _.sum(mandatos, function(eleicao) {
        var preCalculado = this.repo.proporcionalAPopulacao(tipoDeEleicao, eleicao, partido);
        if (preCalculado === 0) {
          return 0;
        }
        if (preCalculado != null) {
          var populacaoDoAnoDaEleicao = this.repo.populacao(tipoDeEleicao.ue, eleicao);
          return preCalculado * (populacaoDoAno / populacaoDoAnoDaEleicao);
        }
        var quantidade = this.repo.quantidade(tipoDeEleicao, eleicao, partido);
        return (quantidade / total) * populacaoDoAno;
      }, this);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    total: function(tipoDeEleicao, ano) {
      return this.repo.populacao(tipoDeEleicao.ue, ano);
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    peso: function(tipoDeEleicao, ano) {
      return this.repo.populacao(tipoDeEleicao.ue, ano);
    }

  };

  /**
   * Interface para um objeto que determina as UEs da esfera.
   *
   * @interface Esfera
   */

  /**
   * Retornar UEs que tem o cargo representando a região.
   *
   * @method Esfera#uesComDados
   * @param {Regiao} regiao
   * @returns {Array<Ue>}
   */

  /**
   * Retornar UEs que tem eleição para o cargo na região.
   *
   * @method Esfera#todasAsUesNaMesmaEsfera
   * @param {Regiao} regiao
   * @returns {Array<Ue>}
   */

  /**
   * @classdesc Esfera federal.
   * @constructor
   * @implements {Esfera}
   */
  function EsferaFederal() {}

  EsferaFederal.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function() {
      // Ignora as UFs, só é necessário um valor para qualquer UF ou município
      return [ 'BR' ];
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUesNaMesmaEsfera: function() {
      // Ignora as UFs, só é necessário um valor para qualquer UF ou município
      return [ 'BR' ];
    }

  };

  /**
   * @classdesc Esfera estadual (exceto DF).
   * @constructor
   * @implements {Esfera}
   */
  function EsferaEstadual() {}

  EsferaEstadual.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(regiao.ues, 'DF');
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUesNaMesmaEsfera: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  /**
   * @classdesc Esfera estadual/municipal para DF.
   * @constructor
   * @implements {Esfera}
   */
  function EsferaDistrital() {}

  EsferaDistrital.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só o distrito federal, depois soma com o estadual
      return _.contains(regiao.ues, 'DF') ? [ 'DF' ] : [];
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUesNaMesmaEsfera: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  /**
   * @classdesc Esfera municipal (exceto DF).
   * @constructor
   * @implements {Esfera}
   */
  function EsferaMunicipal() {}

  EsferaMunicipal.prototype = {

    /**
     * @inheritdoc
     * @nosideeffects
     */
    uesComDados: function(regiao) {
      // Calcula só os estados, depois soma com o distrital
      return _.without(regiao.ues, 'DF');
    },

    /**
     * @inheritdoc
     * @nosideeffects
     */
    todasAsUesNaMesmaEsfera: function(regiao) {
      // Soma todos os estados e o distrito federal
      return regiao.ues;
    }

  };

  /**
   * @classdesc
   * Objeto com dados das eleições para um cargo.
   *
   * @constructor
   * @param {RepositorioEleitoral} repo   - {@link Cargo~repo}
   * @param {IdCargo} idCargo             - {@link Cargo~idCargo}
   * @param {boolean} eleicoesParaRenovar - {@link Cargo~eleicoesParaRenovar}
   */
  function Cargo(repo, idCargo, eleicoesParaRenovar) {
    this.repo                = repo;
    this.idCargo             = idCargo;
    this.eleicoesParaRenovar = eleicoesParaRenovar || 1;
  }

  Cargo.prototype = {

    eleicoes: function(ue) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var anos = this.repo.anosDeEleicao(tipoDeEleicao);
      return anos.slice(this.eleicoesParaRenovar - 1);
    },

    partidos: function(ue, ano) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      var partidosPorMandato = _.map(mandatos, function(anoDaEleicao) {
        return this.repo.partidosComRepresentantes(tipoDeEleicao, anoDaEleicao);
      }, this);
      return _.union.apply(_, partidosPorMandato);
    },

    temDados: function(ue, ano) {
      var tipoDeEleicao = { cargo: this.idCargo, ue: ue };
      var mandatosAtivos = this.repo.mandatosAtivos(tipoDeEleicao, ano + 1);
      return mandatosAtivos.length === this.eleicoesParaRenovar;
    }

  };

  _.extend(ipl, /* @lends ipl */ {
    ResultadoSemPeso:      ResultadoSemPeso,
    ResultadoPorPopulacao: ResultadoPorPopulacao,
    EsferaFederal:         EsferaFederal,
    EsferaEstadual:        EsferaEstadual,
    EsferaDistrital:       EsferaDistrital,
    EsferaMunicipal:       EsferaMunicipal,
    Cargo:                 Cargo
  });

}.call(this, _, ipl));