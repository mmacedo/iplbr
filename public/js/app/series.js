/* globals ipl, _ */
/* exported ipl.GeradorDeSeries */

;(function(ipl, _) {
  'use strict';

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
     * Calcula todos os índices necessários para formatar as séries.
     *
     * @method ipl.GeradorDeSeries~geraIndices
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {Array<ipl.Ano>} anos
     * @param {Array<ipl.IdPartido>} siglas
     * @return {Array<{info:ipl.Partido,indices:Array<{ano:ipl.Ano, indice:number}>}>}
     */
    geraIndices: function(indice, regiao, anos, siglas) {
      return _.map(siglas, function(siglaENumero) {
        // Carrega informações do partido
        var info = _.find(this.partidos.todos(), function(p) {
          return siglaENumero === (p.sigla + p.numero);
        });
        // Calcula índices
        var indices = _.map(anos, function(ano) {
          return { ano: ano, indice: indice.calcula(regiao, ano, siglaENumero) };
        });
        return { info: info, indices: indices };
      }, this);
    },

    /**
     * Remover anos e partidos vazios.
     *
     * @method ipl.GeradorDeSeries~filtraAnos
     * @param {Array<Object>} indicesPorSigla
     * @param {boolean} manterNulls
     * @return {Array<Object>}
     */
    filtraAnos: function(indicesPorSigla, manterNulls) {

      // Filtra anos que o partido existe
      var partidos = _.map(indicesPorSigla, function(p) {

        var indices = p.indices;

        if (manterNulls === true) {
          // No gráfico de área precisa de nulls nos anos que não tem dados
          indices = _.map(indices, function(ponto) {
            if (ponto.ano < p.fundado) {
              return { ano: ponto.ano, indice: null };
            }
            return ponto;
          });
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

        var essencial = _.pick(p, [ 'sigla', 'info', 'mesclados' ]);
        return _.assign(essencial, { indices: indices });
      });

      // Filtra partidos que não tem dados para nenhum ano
      partidos = _.filter(partidos, 'indices.length');

      return partidos;
    },

    /**
     * Garante que sempre as mesmas cores serão usadas para os mesmos partidos.
     *
     * @method ipl.GeradorDeSeries~inicializaCores
     */
    inicializaCores: function() {
      // Realiza primeira chamada de ipl.GerenciadorDeCores#cor na ordem padrão
      _.each(this.partidos.todos(), this.cores.cor, this.cores);
    },

    /**
     * Formata séries para gráfico de linhas ou área do Highcharts.
     *
     * @method ipl.GeradorDeSeries~formataParaGraficoDeLinhasOuAreaHighcharts
     * @param {Array<Object>} indicesPorSigla
     * @return {Array<Object>}
     */
    formataParaGraficoDeLinhasOuAreaHighcharts: function(indicesPorSigla) {

      var tabela = this.configuracao.tabelaDeReescrita;

      this.inicializaCores();

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(p) {

        // Converte anos em datas
        var indices = _.map(p.indices, function(ponto) {
          return { x: Date.UTC(ponto.ano + 1, 0, 1), y: ponto.indice * 100 };
        });

        // Ordena índices por data (Highcharts precisa deles ordenados)
        var indicesOrdenados = _.sortBy(indices, 'x');

        var partidos = p.info != null ? [ p.info ].concat(p.mesclados) : p.mesclados;
        var serie = { name: p.sigla, data: indicesOrdenados, partidos: partidos };

        // Resto
        if (tabela != null && p.sigla === tabela.resto) {
          serie.color = '#333';
          if (this.ehGraficoDeArea === false) { serie.dashStyle = 'dash'; }
          // Substitui null por 0 para mostrar resto em todos os anos
          serie.data = _.map(serie.data, function(ponto) {
            return { x: ponto.x, y: ponto.y || 0.0 };
          });
        } else {
          serie.color = this.cores.cor(p.info);
        }

        return serie;

      }, this);

      var todosOsPontos = _.flatten(_.pluck(indicesPorSigla, 'data'));
      var ultimoAno = _.max(_.pluck(todosOsPontos, 'x'));

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(p) {

        var somaDosIndices = _.reduce(p.data, function(total, ponto) {
          // Não soma último ano se ele foi adicionado porque é gráfico em passos
          if (this.ehGraficoEmPassos === true && ponto.x === ultimoAno) {
            return total;
          }
          return total + ponto.y;
        }, 0, this);

        // Mantem o resto em último (menor)
        if (tabela != null) {
          somaDosIndices += (tabela.resto === p.name) ? 0 : 9999;
        }

        return somaDosIndices;

      }, this).reverse();

      return series;

    },

    /**
     * Formata séries para gráfico de torta do Highcharts.
     *
     * @method ipl.GeradorDeSeries~formataParaGraficoDeTortaHighcharts
     * @param {Array<Object>} indicesPorSigla
     * @return {Array<Object>}
     */
    formataParaGraficoDeTortaHighcharts: function(indicesPorSigla) {

      var tabela = this.configuracao.tabelaDeReescrita;

      this.inicializaCores();

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(p) {

        var serie = {
          name: p.sigla,
          y:    p.indices[0].indice * 100
        };

        // Resto
        if (tabela != null && p.sigla === tabela.resto) {
          serie.color = '#333';
        } else {
          serie.color = this.cores.cor(p.info);
        }

        return serie;

      }, this);

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(p) {

        var indice = p.y;

        // Mantem o resto em último (menor)
        if (tabela != null) {
          indice += (tabela.resto === p.name) ? 0 : 9999;
        }

        return indice;

      }).reverse();

      return [{
        type: 'pie',
        name: 'Índice',
        data: series
      }];

    },

    /**
     * Gera séries com filtro de região.
     *
     * @method ipl.GeradorDeSeries#seriesPorRegiao
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @return {Array<Object>}
     */
    seriesPorRegiao: function(indice, regiao) {
      // Fazendo isso aqui fora uma só vez por motivos de performance
      var anos = _.uniq(indice.anos(regiao).sort(), true);
      // Filtra anos que tem dados o suficiente para calcular o índice
      anos = _.filter(anos, function(ano) {
        return indice.temDados(regiao, ano);
      });
      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.ehGraficoEmPassos === true) {
        anos.push(_.max(anos) + 1);
      }
      // Siglas para todos os anos
      var siglas = _.uniq(_.flatten(_.map(anos, function(ano) {
        return indice.partidos(regiao, ano);
      })).sort(), true);
      var partidos = this.geraIndices(indice, regiao, anos, siglas);
      partidos = this.configuracao.mapearPartidos(partidos);
      partidos = this.filtraAnos(partidos, this.ehGraficoDeArea);
      var series = this.formataParaGraficoDeLinhasOuAreaHighcharts(partidos);
      return series;
    },

    /**
     * Gera séries para um ano específico com filtro de região.
     *
     * @method ipl.GeradorDeSeries#seriesPorAno
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {ipl.Ano} ano
     * @return {Array<Object>}
     */
    seriesPorAno: function(indice, regiao, ano) {
      var anoDaEleicao = ano - 1;
      if (indice.temDados(regiao, anoDaEleicao) === false) {
        // Se não retornar nada, ainda precisa estar em um formato específico
        return this.formataParaGraficoDeTortaHighcharts([]);
      }
      var siglas = indice.partidos(regiao, anoDaEleicao);
      var partidos = this.geraIndices(indice, regiao, [ anoDaEleicao ], siglas);
      partidos = this.configuracao.mapearPartidos(partidos);
      partidos = this.filtraAnos(partidos, this.ehGraficoDeArea);
      var series = this.formataParaGraficoDeTortaHighcharts(partidos);
      return series;
    },

  };

  ipl.GeradorDeSeries = GeradorDeSeries;

})(ipl, _);
