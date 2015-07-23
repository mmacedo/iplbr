/* jshint browser: true */
/* globals ipl, _, jQuery, Big */
/* exported ipl.criaGrafico */
/* exported ipl.filtroPorRegiao */

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
    var matches = $('#jurisdicao').val().match(/(uf)-([a-z]{2})|(regiao)-([a-z]{1,2})|(pais)/);
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

  function criaGraficoDeEvolucaoDoIndice($el, apenas0e100) {
    var curvas, linhas, area, passos;
    if (apenas0e100 === true) {
      curvas = false;
      linhas = false;
      area   = true;
      passos = true;
    } else {
      curvas = $('#tipo_curvas').is(':checked');
      linhas = $('#tipo_linhas').is(':checked');
      area   = $('#tipo_area').is(':checked');
      passos = $('#passos').is(':checked:enabled');
    }

    return $el.highcharts({
      chart: { type: curvas?'spline':linhas?'line':'area' },
      title: { text: $el.data('titulo') },
      subtitle: { text: $el.data('subtitulo') },
      credits: { enabled: false },
      yAxis: {
        title: { text: '%' },
        tickInterval: area ? 20 : 5,
        minorTickInterval: area ? 10 : null,
        min: 0,
        ceiling: 100,
        reversedStacks: true,
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
            label: { text: 'Nova República', style: { fontSize: 'larger' } },
          }, {
            color: 'black',
            value: Date.UTC(1988, 9, 5),
            width: 3,
            label: { text: 'Constituição de 1988', style: { fontSize: 'larger' } },
          }
        ]
      },
      tooltip: {
        shared: true,
        useHTML: true,
        pointFormatter: function() {

          var ano = new Date(this.x).getFullYear() - 1;

          // Não mostra tooltip para extinto
          var partidos = this.series.options.partidos;
          if (_.all(partidos, 'extinto') && _.max(partidos, 'extinto') < ano) {
            return null;
          }

          var indice;
          if (this.y === 0) {
            indice = '0';
          } else {
            var arredondado = new Big(this.y).round(2);
            if (arredondado.eq(0)) {
              indice = '< 0.01';
            } else {
              indice = arredondado.toFixed(2);
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
          marker: { enabled: false },
          step: passos?'left':false
        },
        area: {
          stacking: area?'normal':null,
          states: { hover: { enabled: false } },
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

  function criaGrafico(id, series, indice, apenas0e100) {
    var $el = $(id), chart = $el.highcharts();
    var regiao = filtroPorRegiao(), ano = $('#ano').val();
    if (ano === 'TODOS') {
      if (chart == null) {
        chart = criaGraficoDeEvolucaoDoIndice($el, apenas0e100);
      }
      atualizaGrafico(chart, series.seriesPorRegiao(indice, regiao));
    } else {
      if (chart == null) {
        chart = criaGraficoParaUmUnicoAno($el);
      }
      atualizaGrafico(chart, series.seriesPorAno(indice, regiao, +ano));
    }
  }

  ipl.criaGrafico      = criaGrafico;
  ipl.filtroPorRegiao = filtroPorRegiao;

})(ipl, _, jQuery, Big);
