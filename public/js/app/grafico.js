/* jshint browser: true */
/* globals ipl, _, jQuery, Big */
/* exported ipl.criaGrafico */
/* exported ipl.criaGraficoRadar */
/* exported ipl.filtroPorRegiao */
/* exported ipl.filtroDePartidos */

;(function(ipl, _, $, Big) {
  'use strict';

  var regiaoSul         = [ 'PR', 'RS', 'SC' ];
  var regiaoSudeste     = [ 'ES', 'MG', 'RJ', 'SP' ];
  var regiaoCentroOeste = [ 'DF', 'GO', 'MS', 'MT' ];
  var regiaoNorte       = [ 'AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO' ];
  var regiaoNordeste    = [ 'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE' ];

  var brasil = _.flatten([
    regiaoSul,
    regiaoSudeste,
    regiaoCentroOeste,
    regiaoNorte,
    regiaoNordeste
  ]).sort();

  function filtroPorRegiao() {
    var matches = $('#regiao').val().match(/(uf)-([a-z]{2})|(regiao)-([a-z]{1,2})|(pais)/);
    if (matches[5] === 'pais') {
      return { ues: brasil, nome: 'brasil' };
    } else if (matches[3] === 'regiao') {
      if (matches[4] === 'co') {
        return { ues: regiaoCentroOeste, nome: 'centro-oeste' };
      } else if (matches[4] === 'ne') {
        return { ues: regiaoNordeste, nome: 'nordeste' };
      } else if (matches[4] === 'n') {
        return { ues: regiaoNorte, nome: 'norte' };
      } else if (matches[4] === 'se') {
        return { ues: regiaoSudeste, nome: 'sudeste' };
      } else {
        return { ues: regiaoSul, nome: 'sul' };
      }
    } else {
      return { ues: [ matches[2].toUpperCase() ], nome: matches[2] };
    }
  }

  function filtroDePartidos() {
    var partidos = $('#partidos').val().match(/^(todos|(selecao|partido)-([a-z0-9]+))$/);
    if (partidos[0] === 'todos') {
      return null;
    }
    if (partidos[2] === 'selecao') {
      return { selecao: partidos[3] };
    }
    if (partidos[2] === 'partido') {
      return { partido: partidos[3] };
    }
    return null;
  }

  function criaGraficoDeEvolucaoDoIndice($el, apenas0e100) {
    var curvas, linhas, areas, passos;
    if (apenas0e100 === true) {
      linhas = false;
      areas  = true;
      curvas = false;
      passos = true;
    } else {
      linhas = $('#tipo_linhas').is(':checked');
      areas  = $('#tipo_areas').is(':checked');
      curvas = $('#atenuacao_curvas').is(':checked');
      passos = $('#atenuacao_passos').is(':checked:enabled');
    }

    var filtroPartidos = ipl.filtroDePartidos();
    var apenasUmPartido = filtroPartidos != null && filtroPartidos.partido != null;

    return $el.highcharts({
      chart: { type: curvas?'spline':linhas?'line':'area' },
      title: { text: $el.data('titulo') },
      subtitle: { text: $el.data('subtitulo') },
      credits: { enabled: false },
      yAxis: {
        title: { text: '%' },
        tickInterval: areas ? 20 : 5,
        minorTickInterval: areas ? 10 : null,
        min: 0,
        // Make sure a chart with all zeros is shown in the bottom
        // http://stackoverflow.com/a/23243448/619510
        minRange : 0.1,
        ceiling: 100,
        reversedStacks: true
      },
      xAxis: {
        type: 'datetime',
        tickInterval: 2 * 24 * 3600 * 1000 * 365,
        minorTickInterval: 1 * 24 * 3600 * 1000 * 365,
        plotLines: [
          {
            color: 'black',
            value: Date.UTC(1985, 1, 1),
            width: 3,
            label: { text: 'Nova República', style: { fontSize: 'larger' } }
          }, {
            color: 'black',
            value: Date.UTC(1988, 9, 5),
            width: 3,
            label: { text: 'Constituição de 1988', style: { fontSize: 'larger' } }
          }
        ]
      },
      tooltip: {
        enabled: !apenasUmPartido,
        shared: true,
        useHTML: true,
        pointFormatter: function() {
          var ano = new Date(this.x).getUTCFullYear() - 1;

          // Não mostra tooltip para extinto
          var partidos = this.series.options.partidos;
          if (_.all(partidos, 'extinto') && _.max(partidos, 'extinto') < ano) {
            return null;
          }

          var indice;
          if (this.y === 0) {
            indice = 'Zero';
          } else {
            var arredondado = new Big(this.y).round(2);
            if (arredondado.eq(0)) {
              indice = '< 0.01%';
            } else {
              indice = arredondado.toFixed(2) + '%';
            }
          }

          var cor   = '<span style="color:' + this.color + ';">\u25CF</span>';
          var nome  = this.series.name;
          var valor = '<strong>' + indice + '</strong>';
          return cor + ' ' + nome + ': ' + valor + '<br/>';
        }
      },
      plotOptions: {
        series: {
          marker: { enabled: apenasUmPartido },
          dataLabels: {
            enabled: apenasUmPartido,
            format:  '{point.y:.2f}%'
          },
          step: passos ? 'left' : false
        },
        area: {
          stacking: (areas && !apenasUmPartido) ? 'normal' : null,
          states: { hover: { enabled: apenasUmPartido } }
        }
      }
    }).highcharts();
  }

  function criaGraficoParaUmUnicoAno($el) {
    return $el.highcharts({
      chart: { type: 'pie' },
      title: { text: $el.data('titulo') },
      subtitle: { text: $el.data('subtitulo') },
      credits: { enabled: false },
      tooltip: {
        headerFormat: '<span style="font-size:larger">{series.name}</span><br>',
        pointFormat:  '{point.name}: <strong>{point.y:.2f}%</strong> do total<br/>'
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format:  '<strong>{point.name}</strong>: {point.y:.2f}%'
          }
        }
      }
    }).highcharts();
  }

  function criaGraficoParaUmUnicoAnoPorPartido($el) {
    return $el.highcharts({
      chart: { polar: true },
      title: { text: null },
      pane: { startAngle: -60 },
      xAxis: {
        categories: [ 'Federal', 'Estadual', 'Municipal' ],
        tickmarkPlacement: 'on',
        lineWidth: 0
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        tickInterval: 10,
        minorTickInterval: null,
        min: 0,
        ceiling: 100,
        labels: { enabled: false }
      },
      credits: { enabled: false },
      tooltip: { enabled: false },
      legend: { enabled: false },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format:  '{point.y:.2f}%',
            // Make it visible when the triangle is too small
            allowOverlap: true
          }
        }
      }
    }).highcharts();
  }

  function atualizaGrafico(chart, series) {
    chart.showLoading();
    setTimeout(function() {
      // Remove todas as séries
      _.each(chart.series.slice(), function(series) { series.remove(false); });
      // Adiciona séries
      _.each(series, function(series) { chart.addSeries(series, false); });
      // Atualiza tela
      chart.redraw();
      chart.hideLoading();
    }, 0);
  }

  function criaGrafico(id, geradorDeSeries, indice, apenas0e100) {
    var $el = $(id), chart = $el.highcharts(), series = null;
    var regiao = filtroPorRegiao(), ano = $('#ano').val(), partidos = filtroDePartidos();
    var idPartido  = partidos && partidos.partido;
    if (ano === 'todos') {
      if (idPartido != null) {
        if (chart == null) {
          chart = criaGraficoDeEvolucaoDoIndice($el, apenas0e100);
        }
        series = geradorDeSeries.evolucaoDoIndicePorPartido(indice, regiao, idPartido);
      } else {
        if (chart == null) {
          chart = criaGraficoDeEvolucaoDoIndice($el, apenas0e100);
        }
        series = geradorDeSeries.evolucaoDoIndice(indice, regiao);
      }
    } else {
      if (idPartido == null) {
        if (chart == null) {
          chart = criaGraficoParaUmUnicoAno($el);
        }
        series = geradorDeSeries.indiceNoAno(indice, regiao, +ano);
      }
    }
    atualizaGrafico(chart, series);
  }

  function criaGraficoRadar(id, geradorDeSeries, indiceFederal, indiceEstadual, indiceMunicipal) {
    var $el = $(id), chart = $el.highcharts();
    if (chart == null) {
      chart = criaGraficoParaUmUnicoAnoPorPartido($el);
    }
    var regiao = filtroPorRegiao(), ano = $('#ano').val(), partidos = filtroDePartidos();
    var idPartido  = partidos && partidos.partido;
    var series = geradorDeSeries.indiceNoAnoPorPartido(indiceFederal, indiceEstadual, indiceMunicipal, regiao, +ano, idPartido);
    atualizaGrafico(chart, series);
  }

  ipl.criaGrafico      = criaGrafico;
  ipl.criaGraficoRadar = criaGraficoRadar;
  ipl.filtroPorRegiao  = filtroPorRegiao;
  ipl.filtroDePartidos = filtroDePartidos;

})(ipl, _, jQuery, Big);
