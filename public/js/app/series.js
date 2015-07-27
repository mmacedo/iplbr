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

  /** @const {ipl.Tom} */
  var COR_SERIE_RESTO = '#333';

  GeradorDeSeries.prototype = {

    /**
     * Calcula todos os índices necessários para formatar as séries.
     *
     * @method ipl.GeradorDeSeries~geraIndices
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {Array<ipl.Ano>} anos
     * @return {Array<ipl.Serie>}
     */
    geraIndices: function(indice, regiao, anos) {
      // Siglas para todos os anos
      var idPartidos = _.uniq(_.flatten(_.map(anos, function(ano) {
        return indice.partidos(regiao, ano);
      })).sort(), true);
      var partidos = this.partidos.todos();
      return _.map(idPartidos, function(siglaENumero) {
        // Carrega informações do partido
        var info = _.find(partidos, function(p) {
          return siglaENumero === (p.sigla + p.numero);
        });
        // Calcula índices
        var indices = _.map(anos, function(ano) {
          return { ano: ano, indice: indice.calcula(regiao, ano, siglaENumero) };
        });
        return { info: info, indices: indices };
      });
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
        var essencial = _.pick(p, [ 'sigla', 'info', 'mesclados' ]);
        essencial.indices = indices;
        return essencial;
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
    },

    /**
     * Formata séries para gráfico de linhas ou área do Highcharts.
     *
     * @method ipl.GeradorDeSeries~formataParaLinhasOuAreasHighcharts
     * @param {Array<ipl.Serie2>} seriesNaoFormatadas
     * @return {Array<Object>}
     */
    formataParaLinhasOuAreasHighcharts: function(seriesNaoFormatadas) {
      var tabela = this.configuracao.tabelaDeReescrita;
      this.inicializaCores();
      // Converte série para o formato esperado
      var series = _.map(seriesNaoFormatadas, function(p) {
        // Converte pontos para o formato esperado
        var pontos = _.map(p.indices, function(ponto) {
          return { x: Date.UTC(ponto.ano + 1, 0, 1), y: ponto.indice * 100 };
        });
        // Ordena índices por data (Highcharts precisa deles ordenados)
        var indicesOrdenados = _.sortBy(pontos, 'x');
        var partidos = p.info != null ? [ p.info ].concat(p.mesclados) : p.mesclados;
        var serie = { name: p.sigla, data: indicesOrdenados, partidos: partidos };
        // Aparência da série
        if (tabela != null && p.sigla === tabela.resto) {
          // Resto
          serie.color = COR_SERIE_RESTO;
          // Linha tracejada
          if (this.ehGraficoDeArea === false) { serie.dashStyle = 'dash'; }
          // Substitui null por 0 para mostrar resto em todos os anos
          serie.data = _.map(serie.data, function(p) { return { x: p.x, y: p.y || 0 }; });
        } else {
          // Cor da série
          serie.color = this.cores.cor(p.info);
        }
        return serie;
      }, this);
      var todosOsPontos = _.flatten(_.pluck(series, 'data'));
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
        // Mantém o resto por último (adiciona 9999 nos demais)
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
     * @method ipl.GeradorDeSeries~formataParaTortaHighcharts
     * @param {Array<ipl.Serie2>} seriesNaoFormatadas
     * @return {Array<Object>}
     */
    formataParaTortaHighcharts: function(seriesNaoFormatadas) {
      var tabela = this.configuracao.tabelaDeReescrita;
      this.inicializaCores();
      // Converte série para o formato esperado pelo Highcharts
      var series = _.map(seriesNaoFormatadas, function(p) {
        var serie = { name: p.sigla, y: p.indices[0].indice * 100 };
        // Cor da série
        var ehResto = tabela != null && p.sigla === tabela.resto;
        serie.color = ehResto ? COR_SERIE_RESTO : this.cores.cor(p.info);
        return serie;
      }, this);
      // Ordena pelo índice (descendente)
      series = _.sortBy(series, function(p) {
        var indice = p.y;
        // Mantém o resto por último (adiciona 9999 nos demais)
        if (tabela != null) {
          indice += (tabela.resto === p.name) ? 0 : 9999;
        }
        return indice;
      }).reverse();
      // Retorna como uma série do tipo torta
      return [{ type: 'pie', name: 'Índice', data: series }];
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
      var anos = _.uniq(indice.eleicoes(regiao).sort(), true);
      // Filtra anos que tem dados o suficiente para calcular o índice
      anos = _.filter(anos, function(ano) {
        return indice.temDados(regiao, ano);
      });
      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.ehGraficoEmPassos === true) {
        anos.push(_.max(anos) + 1);
      }
      var series = this.geraIndices(indice, regiao, anos);
      series = this.configuracao.mapeiaPartidos(series);
      series = this.filtraAnos(series, this.ehGraficoDeArea);
      series = this.filtraPartidos(series);
      series = this.formataParaLinhasOuAreasHighcharts(series);
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
        return this.formataParaTortaHighcharts([]);
      }
      var series = this.geraIndices(indice, regiao, [ anoDaEleicao ]);
      series = this.configuracao.mapeiaPartidos(series);
      series = this.filtraAnos(series, this.ehGraficoDeArea);
      series = this.filtraPartidos(series);
      series = this.formataParaTortaHighcharts(series);
      return series;
    }

  };

  ipl.GeradorDeSeries = GeradorDeSeries;

})(ipl, _);
