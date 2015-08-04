/* globals ipl, _ */
/* exported ipl.GeradorDeSeries */

;(function(ipl, _) {
  'use strict';

  /**
   * Ponto da série.
   *
   * @typedef ipl.PontoDaSerie
   * @property {ipl.Ano} ano
   * @property {number} indice
   */

  /**
   * Série (formato mínimo).
   *
   * @typedef ipl.Serie
   * @property {string} nome
   * @property {ipl.Ano} fundado
   * @property {?ipl.Ano} extinto
   * @property {ipl.Partido} info
   * @property {Array<ipl.PontoDaSerie>} indices
   */

  /**
   * @classdesc Gera séries para os gráficos.
   *
   * @alias ipl.GeradorDeSeries
   * @constructor
   * @param {ipl.ConfiguracaoDePartidos} configuracao
   *   {@link ipl.GeradorDeSeries#configuracao}
   * @param {ipl.RepositorioDePartidos} partidos
   *   {@link ipl.GeradorDeSeries#partidos}
   * @param {ipl.GerenciadorDeCores} partidos
   *   {@link ipl.GeradorDeSeries#cores}
   */
  function GeradorDeSeries(configuracao, partidos, cores) {
    /**
     * Configuração de partidos.
     * @member {ipl.ConfiguracaoDePartidos} ipl.GeradorDeSeries#configuracao
     */
    this.configuracao = configuracao;
    /**
     * Repositório de partidos.
     * @member {ipl.ConfiguracaoDePartidos} ipl.GeradorDeSeries#partidos
     */
    this.partidos = partidos;
    /**
     * Gerenciador de cores.
     * @member {ipl.GerenciadorDeCores} ipl.GeradorDeSeries#cores
     */
    this.cores = cores;
    /**
     * Faz correções para gráficos em passos.
     * @member {boolean} ipl.GeradorDeSeries#ehGraficoEmPassos
     * @default
     */
    this.ehGraficoEmPassos = false;
    /**
     * Faz correções para gráficos de área.
     * @member {boolean} ipl.GeradorDeSeries#ehGraficoDeArea
     * @default
     */
    this.ehGraficoDeArea = false;
  }

  GeradorDeSeries.prototype = {

    /**
     * Retorna anos de eleição.
     *
     * @method ipl.GeradorDeSeries~eleicoes
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @return {Array<ipl.Ano>}
     */
    eleicoes: function(indice, regiao) {
      // Fazendo isso aqui fora uma só vez por motivos de performance
      var anos = _.uniq(indice.eleicoes(regiao).sort(), true);
      // Filtra anos que tem dados o suficiente para calcular o índice
      anos = _.filter(anos, function(ano) {
        return indice.temDados(regiao, ano);
      });
      return anos;
    },

    /**
     * Retorna partidos com representantes.
     *
     * @method ipl.GeradorDeSeries~idPartidos
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {Array<ipl.Ano>} eleicoes
     * @return {Array<ipl.IdPartido>}
     */
    idPartidos: function(indice, regiao, eleicoes) {
      return _.uniq(_.flatten(_.map(eleicoes, function(ano) {
        return indice.partidos(regiao, ano);
      })).sort(), true);
    },

    /**
     * Calcula todos os índices necessários para formatar as séries.
     *
     * @method ipl.GeradorDeSeries~geraIndices
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {Array<ipl.Ano>} anos
     * @param {?ipl.IdPartido} idPartido
     * @return {Array<ipl.Serie>}
     */
    geraIndices: function(indice, regiao, anoDeEleicao, idPartido) {
      var eleicoes = anoDeEleicao != null ?
        [ anoDeEleicao ] :
        this.eleicoes(indice, regiao);
      var partidos = idPartido != null ?
        _.sortBy(this.partidos.buscaPredecessores(
          this.partidos.buscaSiglaENumero(ipl.RepositorioDePartidos.normalizaSiglaENumero(idPartido)),
          this.configuracao.mudancasDeNome,
          this.configuracao.incorporacoes,
          this.configuracao.fusoes), 'fundado') :
        _.map(this.idPartidos(indice, regiao, eleicoes), function(idPartido) {
          return this.partidos.buscaSiglaENumero(idPartido);
        }, this);
      return _.map(partidos, function(info) {
        // Calcula índices
        var indices = _.map(eleicoes, function(ano) {
          return { ano: ano, indice: indice.calcula(regiao, ano, info.sigla + info.numero) };
        });
        return {
          nome:    info.sigla,
          fundado: info.fundado,
          extinto: info.extinto,
          info:    info,
          indices: indices
        };
      }, this);
    },

    /**
     * Remover anos que não tem dados para cada partido.
     *
     * @method ipl.GeradorDeSeries~filtraAnos
     * @param {Array<ipl.Serie2>} series
     * @param {boolean} manterNulos
     * @return {Array<ipl.Serie2>}
     */
    filtraAnos: function(series, manterNulos) {
      return _.map(series, function(p) {
        var indices = p.indices;
        // Manter anos sem índice como nulo
        if (manterNulos === true) {
          // No gráfico de área precisa de nulls nos anos que não tem dados
          indices = _.map(indices, function(ponto) {
            if (ponto.ano < p.fundado) {
              return { ano: ponto.ano, indice: null };
            }
            return ponto;
          });
        // Remover anos sem índice
        } else {
          // Remover pontos antes da fundação
          indices = _.filter(indices, function(ponto) {
            return ponto.ano >= p.fundado;
          });
          if (p.extinto != null) {
            // Remover pontos após a extinção
            indices = _.filter(indices, function(ponto) {
              return ponto.ano <= p.extinto;
            });
          }
        }
        return _.extend({}, p, { indices: indices });
      });
    },

    /**
     * Remover séries que não tem dados para nenhum ano.
     *
     * @method ipl.GeradorDeSeries~filtraPartidos
     * @param {Array<ipl.Serie2>} series
     * @return {Array<ipl.Serie2>}
     */
    filtraPartidos: function(series) {
      return _.filter(series, 'indices.length');
    },

    /**
     * Garante que sempre as mesmas cores serão usadas para os mesmos partidos.
     *
     * @method ipl.GeradorDeSeries~inicializaCores
     */
    inicializaCores: function() {
      // Realiza primeira chamada de ipl.GerenciadorDeCores#cor na ordem padrão
      _.each(this.partidos.todos(), this.cores.cor, this.cores);
    }

  };

  ipl.GeradorDeSeries = GeradorDeSeries;

})(ipl, _);
