/* globals ipl, _ */
/* exported ipl.GeradorDeSeries */

;(function(ipl, _) {
  'use strict';

  /** @const {ipl.Tom} */
  ipl.GeradorDeSeries.COR_RESTO = '#333333';

  /** @const {string} */
  ipl.GeradorDeSeries.LINHA_RESTO = 'dash';

  _.extend(ipl.GeradorDeSeries.prototype, /** @lends ipl.GeradorDeSeries.prototype */ {

    /**
     * Formata séries para gráfico de linhas ou área do Highcharts.
     *
     * @method ipl.GeradorDeSeries~seriesHighcharts
     * @param {Array<ipl.Serie2>} seriesNaoFormatadas
     * @return {Array<Object>}
     */
    seriesHighcharts: function(seriesNaoFormatadas) {
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
        var mesclados = p.mesclados || [];
        var partidos = p.info != null ? [ p.info ].concat(mesclados) : mesclados;
        var serie = { name: p.nome, data: indicesOrdenados, partidos: partidos };
        // Aparência da série
        if (tabela != null && p.nome === tabela.resto()) {
          // Resto:
          // Cor preta
          serie.color = ipl.GeradorDeSeries.COR_RESTO;
          // Linha tracejada
          if (this.ehGraficoDeArea === false) {
            serie.dashStyle = ipl.GeradorDeSeries.LINHA_RESTO;
          }
          // Substitui null por 0 para mostrar resto em todos os anos
          serie.data = _.map(serie.data, function(p) { return { x: p.x, y: p.y || 0 }; });
        } else {
          // Cor da série
          serie.color = this.cores.cor(p.info);
        }
        return serie;
      }, this);
      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(p) {
        var somaDosIndices = _.sum(p.data, 'y');
        // Mantém o resto por último (adiciona 100000 nos demais)
        if (tabela != null) {
          somaDosIndices += (tabela.resto() === p.name) ? 0 : 100000;
        }
        return somaDosIndices;
      }, this).reverse();
      // Duplica o último ano para torná-lo visível no gráfico em passos
      if (this.ehGraficoEmPassos === true) {
        var ultimoAno  = _(series).pluck('data').map(_.last).compact().pluck('x').max();
        var proximoAno = Date.UTC(new Date(ultimoAno).getUTCFullYear() + 1, 0, 1);
        _.each(series, function(p) {
          var maiorAno = _.last(p.data);
          if (maiorAno.x === ultimoAno) {
            p.data.push({ x: proximoAno, y: maiorAno.y });
          }
        });
      }
      return series;
    },

    /**
     * Formata séries para gráfico de torta do Highcharts.
     *
     * @method ipl.GeradorDeSeries~serieTortaHighcharts
     * @param {Array<ipl.Serie2>} seriesNaoFormatadas
     * @return {Array<Object>}
     */
    serieTortaHighcharts: function(seriesNaoFormatadas) {
      var tabela = this.configuracao.tabelaDeReescrita;
      this.inicializaCores();
      // Converte série para o formato esperado pelo Highcharts
      var series = _.map(seriesNaoFormatadas, function(p) {
        var partidos = p.info != null ? [ p.info ].concat(p.mesclados) : p.mesclados;
        var serie = { name: p.nome, y: p.indices[0].indice * 100, partidos: partidos };
        // Cor da série
        var ehResto = tabela != null && p.nome === tabela.resto();
        serie.color = ehResto ? ipl.GeradorDeSeries.COR_RESTO : this.cores.cor(p.info);
        return serie;
      }, this);
      // Ordena pelo índice (descendente)
      series = _.sortBy(series, function(p) {
        var indice = p.y;
        // Mantém o resto por último (adiciona 100000 nos demais)
        if (tabela != null) {
          indice += (tabela.resto() === p.name) ? 0 : 100000;
        }
        return indice;
      }).reverse();
      // Retorna como uma série do tipo torta
      return { type: 'pie', name: 'Índice', data: series };
    },

    /**
     * Formata séries para gráfico de radar do Highcharts.
     *
     * @method ipl.GeradorDeSeries~serieRadarHighcharts
     * @param {Array<ipl.Serie2>} serieFederal
     * @param {Array<ipl.Serie2>} serieEstadual
     * @param {Array<ipl.Serie2>} serieMunicipal
     * @return {Array<Object>}
     */
    serieRadarHighcharts: function(serieFederal, serieEstadual, serieMunicipal) {
      return {
        type: 'area',
        name: serieFederal.nome,
        color: this.cores.cor(serieFederal.info),
        data: [
          { name: 'Federal', y: serieFederal.indices[0].indice * 100,
            dataLabels: { align: 'center', verticalAlign: 'bottom' } },
          { name: 'Estadual', y: serieEstadual.indices[0].indice * 100,
            dataLabels: { align: 'left', verticalAlign: 'top' } },
          { name: 'Municipal', y: serieMunicipal.indices[0].indice * 100,
            dataLabels: { align: 'right', verticalAlign: 'top' } }
        ]
      };
    },

    /**
     * Gera séries com filtro de região.
     *
     * @method ipl.GeradorDeSeries#evolucaoDoIndice
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @return {Array<Object>}
     */
    evolucaoDoIndice: function(indice, regiao) {
      var series = this.geraIndices(indice, regiao, null, null);
      series = this.configuracao.mapeiaPartidos(series);
      series = this.filtraAnos(series, this.ehGraficoDeArea);
      series = this.filtraPartidos(series);
      series = this.seriesHighcharts(series);
      return series;
    },

    /**
     * Gera séries para um ano específico com filtro de região.
     *
     * @method ipl.GeradorDeSeries#evolucaoDoIndicePorPartido
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {ipl.Ano} ano
     * @param {ipl.IdPartido} idPartido
     * @return {Array<Object>}
     */
    evolucaoDoIndicePorPartido: function(indice, regiao, idPartido) {
      var series = this.geraIndices(indice, regiao, null, idPartido);
      series = this.configuracao.mapeiaPartidos(series);
      series = this.filtraAnos(series, this.ehGraficoDeArea);
      series = this.seriesHighcharts(series);
      return series;
    },

    /**
     * Gera séries para um ano específico com filtro de região.
     *
     * @method ipl.GeradorDeSeries#indiceNoAno
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {ipl.Ano} ano
     * @return {Array<Object>}
     */
    indiceNoAno: function(indice, regiao, ano) {
      var anoDaEleicao = ano - 1;
      if (indice.temDados(regiao, anoDaEleicao) === false) {
        // Se não retornar nada, ainda precisa estar em um formato específico
        return [ this.serieTortaHighcharts([]) ];
      }
      var series = this.geraIndices(indice, regiao, anoDaEleicao, null);
      series = this.configuracao.mapeiaPartidos(series);
      series = this.filtraPartidos(series);
      series = [ this.serieTortaHighcharts(series) ];
      return series;
    },

    /**
     * Gera séries para um ano específico com filtro de região.
     *
     * @method ipl.GeradorDeSeries#indiceNoAnoPorPartido
     * @param {ipl.Indice} indice
     * @param {ipl.Regiao} regiao
     * @param {ipl.Ano} ano
     * @param {ipl.IdPartido} idPartido
     * @return {Array<Object>}
     */
    indiceNoAnoPorPartido: function(indiceFederal, indiceEstadual, indiceMunicipal, regiao, ano, idPartido) {
      var anoDaEleicao = ano - 1;
      if (indiceFederal.temDados(regiao, anoDaEleicao) === false ||
          indiceEstadual.temDados(regiao, anoDaEleicao) === false ||
          indiceMunicipal.temDados(regiao, anoDaEleicao) === false) {
        return [];
      }
      var federal   = this.geraIndices(indiceFederal, regiao, anoDaEleicao, idPartido)[0];
      var estadual  = this.geraIndices(indiceEstadual, regiao, anoDaEleicao, idPartido)[0];
      var municipal = this.geraIndices(indiceMunicipal, regiao, anoDaEleicao, idPartido)[0];
      var series = [ this.serieRadarHighcharts(federal, estadual, municipal) ];
      return series;
    }

  });

})(ipl, _);
