"use strict";

(function($, _, Highcharts) {

  Highcharts.setOptions({
    lang: {
      decimalPoint:       ',',
      thousandsSep:       '.',
      noData:             'Sem dados para exibir',
      contextButtonTitle: 'Exportar',
      printChart:         'Imprimir gráfico',
      downloadPNG:        'Baixar como imagem PNG',
      downloadJPEG:       'Baixar como imagem JPEG',
      downloadPDF:        'Baixar como documento PDF',
      downloadSVG:        'Baixar como vetor gráfico SVG',
      loading:            'Carregando...'
    }
  });

  function atualizaConfiguracao(cfg, apenas0e100) {
    cfg.mudancasDeNome    = $('#mudancas_de_nome').is(':checked:enabled');
    cfg.incorporacoes     = $('#incorporacoes').is(':checked:enabled');
    cfg.fusoes            = $('#fusoes').is(':checked:enabled');

    if ($('#configuracao_todos').is(':checked')) {
      cfg.tabelaDeReescrita = null;
    } else if ($('#configuracao_top10').is(':checked')) {
      cfg.tabelaDeReescrita = Configuracao.top10;
    } else if ($('#configuracao_top3').is(':checked')) {
      cfg.tabelaDeReescrita = Configuracao.top3;
    } else if ($('#configuracao_antigos').is(':checked')) {
      cfg.tabelaDeReescrita = Configuracao.partidosAntigos;
    }

    cfg.ehGraficoEmPassos = apenas0e100 === true || $('#passos').is(':checked:enabled');
    cfg.ehGraficoDeArea   = apenas0e100 === true || $('#tipo_area').is(':checked');
  }

  function filtroJurisdicao() {
    var matches = $('#jurisdicao').val().match(/(uf)-([a-z]{2})|(regiao)-([a-z]{1,2})|(pais)/);
    if (matches[5] === 'pais') {
      return Configuracao.brasil;
    } else if (matches[3] === 'regiao') {
      if (matches[4] === 'co') {
        return Configuracao.regiaoCentroOeste;
      } else if (matches[4] === 'ne') {
        return Configuracao.regiaoNordeste;
      } else if (matches[4] === 'n') {
        return Configuracao.regiaoNorte;
      } else if (matches[4] === 'se') {
        return Configuracao.regiaoSudeste;
      } else {
        return Configuracao.regiaoSul;
      }
    } else {
      return [ matches[2].toUpperCase() ];
    }
  }

  function criaGrafico(id, titulo, subtitulo, serie, indice, apenas0e100) {

    var ufs = filtroJurisdicao(), ano = $('#ano').val();

    var $el = $(id), chart = $el.highcharts();

    if (ano === 'TODOS') {

      if (chart == null) {

        var curvasSelecionado  = $('#tipo_curvas').is(':checked'),
            linhasSelectionado = $('#tipo_linhas').is(':checked'),
            areaSelecionado    = $('#tipo_area').is(':checked');

        var passosSelecionado = $('#passos').is(':checked:enabled');

        if (apenas0e100 === true) {
          curvasSelecionado  = false;
          linhasSelectionado = false;
          areaSelecionado    = true;
          passosSelecionado  = true;
        }

        var chartType = curvasSelecionado?'spline':linhasSelectionado?'line':'area';
        var stacking  = areaSelecionado?'normal':null;

        chart = $el.highcharts({
          chart: { type: chartType },
          title: { text: titulo },
          subtitle: { text: subtitulo },
          credits: { enabled: false },
          yAxis: {
            title: { text: '%' },
            tickInterval: areaSelecionado ? 20 : 5,
            minorTickInterval: areaSelecionado ? 10 : null,
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
              var partidos = _.compact([ this.series.options.partido ].concat(this.series.options.outros || []));
              if (_.all(partidos, function(p) { return p.extinto != null; }) && _.max(partidos, 'extinto') < ano) {
                return null;
              }

              var indice;
              if (this.y == 0) {
                indice = '0';
              } else {
                var arredondado = Math.round10(this.y, 2);
                if (arredondado == 0) {
                  indice = '< 0.01';
                } else {
                  indice = arredondado.toFixed(2);
                }
              }

              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + indice + '</b><br/>';
            }
          },
          plotOptions: {
            series: {
              marker: { enabled: false },
              step: passosSelecionado?'left':false
            },
            area: {
              stacking: stacking,
              states: { hover: { enabled: false } },
            }
          }
        }).highcharts();
      }

      chart.showLoading();

      setTimeout(function() {
        // Remove todas as séries
        _.each(chart.series.slice(), function(series) { series.remove(false); });

        // Adiciona séries
        _.each(serie.seriesPorJurisdicao(indice, ufs), function(series) {
          chart.addSeries(series, false);
        });

        // Atualiza tela
        chart.redraw();
        chart.hideLoading();
      }, 0);

    } else {

      if (chart == null) {
        chart = $(id).highcharts({
          chart: { type: 'pie' },
          title: { text: titulo },
          subtitle: { text: subtitulo },
          credits: { enabled: false },
          tooltip: {
            headerFormat: '<span style="font-size:larger">{series.name}</span><br>',
            pointFormat:  '{point.name}: <b>{point.y:.4f}%</b> do total<br/>'
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format:  '<b style="color:{point.color}">{point.name}</b>: {point.y:.4f}%'
              }
            }
          }
        }).highcharts();
      }

      chart.showLoading();

      setTimeout(function() {
        // Remove todas as séries
        _.each(chart.series.slice(), function(series) { series.remove(false); });

        // Adiciona séries
        _.each(serie.seriesPorAno(indice, ufs, parseInt(ano, 10)), function(series) {
          chart.addSeries(series, false);
        });

        // Atualiza tela
        chart.redraw();
        chart.hideLoading();
      }, 0);

    }
  }

  function atualizaTela(estado) {
    var titulo;
    fazerMudancas(function() {
      if (estado.selecao === 'todos') {
        titulo = 'Todos';
        $('#configuracao_todos').click();
        $('#mudancas_de_nome').prop('checked', true);
        $('#incorporacoes, #fusoes').prop('checked', false);
      } else if (estado.selecao === 'top3') {
        titulo = 'Top 3';
        $('#configuracao_top3').click();
      } else if (estado.selecao === 'top10') {
        titulo = 'Top 10';
        $('#configuracao_top10').click();
      } else if (estado.selecao === 'antigos') {
        titulo = 'Antigos';
        $('#configuracao_antigos').click();
      }
    });
    return titulo;
  }

  function adicionaHistoria() {

    if (window.fazendoMudancas === true) {
      return;
    }

    var titulo, selecao;
    if ($('#configuracao_todos').is(':checked')) {
      titulo = 'Todos';
      selecao = 'todos';
    } else if ($('#configuracao_top10').is(':checked')) {
      titulo = 'Top 10';
      selecao = 'top10';
    } else if ($('#configuracao_top3').is(':checked')) {
      titulo = 'Top 3';
      selecao = 'top3';
    } else if ($('#configuracao_antigos').is(':checked')) {
      titulo = 'Antigos';
      selecao = 'antigos';
    }

    history.pushState({ selecao: selecao }, titulo, '#' + selecao);
  }

  function recriaGraficosDaGuiaAtual(forcaDestruicao) {

    if (forcaDestruicao === true) {
      // Destrói todos os gráficos (update tá com bug quando muda para tipo area)
      _.each(Highcharts.charts, function(chart) {
        if (chart != null) {
          chart.destroy();
        }
      });
    }

    if (window.fazendoMudancas === true) {
      return;
    }

    $('#tablist_graficos > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');

  }

  function fazerMudancas(mudancas) {
    window.fazendoMudancas = true;
    mudancas();
    window.fazendoMudancas = false;
    recriaGraficosDaGuiaAtual();
  }

  $(function() {

    // Restaura configurações de partidos
    $(document).on('click', '#cfg_partidos > a.cfg_remover', function() {
      fazerMudancas(function() {
        $('#configuracao_todos').trigger('click');
        $('#mudancas_de_nome').prop('checked', true);
        $('#incorporacoes, #fusoes').prop('checked', false);
        adicionaHistoria();
      });
      return false;
    });

    // Esconde link para remover configurãção quando expandir o painel
    $(document).on('show.bs.collapse', '#panel_cfg_partidos', function () {
      $('#cfg_partidos').hide();
    }).on('hidden.bs.collapse', '#panel_cfg_partidos', function () {
      if ($('#cfg_partidos > .cfg_label').text() !== "") {
        $('#cfg_partidos').show();
      } else {
        $('#cfg_partidos').hide();
      }
    });

    // Esconde painel de personalização quando selecionar pré-definição
    $(document).on('change', '[name="configuracao_predefinida"]', function() {
      if ($('#configuracao_todos').is(':checked')) {
        $('#panel_retroativo').addClass('in');
      } else {
        $('#panel_retroativo').removeClass('in');
      }
    });

    // Esconde tipo de gráfico quando o ano for selecionado (apenas torta)
    $(document).on('change', '#ano', function() {
      if ($('#ano').val() === 'TODOS') {
        $('#panel_tipo_de_grafico').addClass('in');
      } else {
        $('#panel_tipo_de_grafico').removeClass('in');
      }
    });

    // Mostra botão para remover pré-definição
    $(document).on('change', '[name="configuracao_predefinida"], #mudancas_de_nome, #incorporacoes, #fusoes', function() {

      if ($('#configuracao_todos').is(':checked')) {
        $('#cfg_partidos .cfg_label').text('');
        $('#cfg_partidos').hide();
      } else {
        if ($('#configuracao_top10').is(':checked')) {
          $('#cfg_partidos .cfg_label').text('Pré-definição: Top 10');
        } else if ($('#configuracao_top3').is(':checked')) {
          $('#cfg_partidos .cfg_label').text('Pré-definição: Top 3');
        } else if ($('#configuracao_antigos').is(':checked')) {
          $('#cfg_partidos .cfg_label').text('Pré-definição: Antigos');
        }

        if ($('#panel_cfg_partidos').hasClass('in')) {
          $('#cfg_partidos').hide();
        } else {
          $('#cfg_partidos').show();
        }
      }
    });

    // Esconde 'Em passos' quando o tipo de gráfico não permitir isso
    $(document).on('change', '[name="tipo_de_grafico"]', function() {
      if ($('#tipo_curvas').is(':checked')) {
        $('#passos')
          .prop('disabled', true)
          .closest('.checkbox')
          .addClass('disabled')
      } else {
        $('#passos')
          .prop('disabled', false)
          .closest('.checkbox')
          .removeClass('disabled')
      }
    });

    // Precisa atualizar séries (remove série e readiciona)
    $(document).on('change', '[name="configuracao_predefinida"], #mudancas_de_nome, #incorporacoes, #fusoes', function() {
      adicionaHistoria();
      recriaGraficosDaGuiaAtual(false);
    });

    // Precisa atualizar séries (destrói gráfico e recria)
    $(document).on('change', '[name="tipo_de_grafico"], #passos, #jurisdicao, #ano', function() {
      adicionaHistoria();
      recriaGraficosDaGuiaAtual(true);
    });

    // Redesenha gráficos que estavam em elementos escondidos
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      var panel_id = $(this).attr('aria-controls');
      $("#" + panel_id + " [data-highcharts-chart]").each(function() {
        $(this).highcharts().redraw();
        $(this).highcharts().reflow();
      });
    });

    $.getJSON('eleitos.json').done(function(json) {

      var cfg     = new Configuracao();

      cfg.cores = {
        'verde':      [ '#6ed854', '#a9ff97', '#00ff99' ],
        'vermelho':   [ '#df5353', '#E86850', '#dc143c', '#ed7db7' ],
        'laranja':    [ '#f7a35c', '#edb47e' ],
        'azul':       [ '#7cb5ec', '#3366cc', '#90b1d8', '#6699ff' ],
        'azul claro': [ '#7eedeb', '#7dedeb' ],
        'roxo':       [ '#be55d9', '#7e80ed', '#996699' ],
      };

      var serie   = new Serie(cfg);
      var indices = new GeradorDeIndices(json);

      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_indice_total"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico('#indice_total', 'Índice', 'Federal / 3 + Estadual / 3 + Municipal / 3', serie, indices.indiceTotal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_legislativo_total"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico('#legislativo_total', 'Legislativo', 'Legislativo Federal / 3 + Legislativo Estadual / 3 + Legislativo Municipal / 3', serie, indices.legislativoTotal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_executivo_total"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico('#executivo_total', 'Executivo', 'Executivo Federal / 3 + Executivo Estadual / 3 + Executivo Municipal / 3', serie, indices.executivoTotal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_indice_federal"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#indice_federal", 'Índice Federal', 'congresso = 75% e presidente = 25%', serie, indices.indiceFederal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_legislativo_federal"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#deputados_federais", 'Câmara dos Deputados', null,                                    serie, indices.deputadosFederais());
        criaGrafico("#senadores",          'Senado Federal',       null,                                    serie, indices.senadores());
        criaGrafico("#congresso_nacional", 'Congresso Nacional',   'Câmara dos Deputados + Senado Federal', serie, indices.legislativoFederal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_executivo_federal"]', function() {
        atualizaConfiguracao(cfg, true);
        criaGrafico("#presidentes", 'Presidência da República', null, serie, indices.executivoFederal(), true);
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_indice_estadual"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#indice_estadual", 'Índice Estadual', 'deputados estaduais = 75% e governadores = 25%', serie, indices.indiceEstadual());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_legislativo_estadual"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#deputados_estaduais", 'Assembléias Legislativas Estaduais ou Distritais', null, serie, indices.legislativoEstadual());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_executivo_estadual"]', function() {
        var estaMostrandoApenasUmaUf = filtroJurisdicao().length === 1;
        atualizaConfiguracao(cfg, estaMostrandoApenasUmaUf);
        criaGrafico("#governadores", 'Governos Estaduais', null, serie, indices.executivoEstadual(), estaMostrandoApenasUmaUf);
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_indice_municipal"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#indice_municipal", 'Índice Municipal', 'vereadores = 75% e prefeitos = 25%', serie, indices.indiceMunicipal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_legislativo_municipal"]', function() {
        atualizaConfiguracao(cfg);
        criaGrafico("#vereadores", 'Câmaras Municipais', null, serie, indices.legislativoMunicipal());
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_executivo_municipal"]', function() {
        var ufs = filtroJurisdicao(), estaMostrandoApenasDf = ufs.length === 1 && ufs[0] === 'DF';
        atualizaConfiguracao(cfg, estaMostrandoApenasDf);
        criaGrafico("#prefeitos", 'Prefeituras', null, serie, indices.executivoMunicipal(), estaMostrandoApenasDf);
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_total"]', function() {
        $('#tablist_total > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_federal"]', function() {
        $('#tablist_federal > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_estadual"]', function() {
        $('#tablist_estadual > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"][aria-controls="tab_municipal"]', function() {
        $('#tablist_municipal > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      });

      if (history.state == null) {
        // Primeiro carregamento da tela
        var hash   = window.location.hash ? window.location.hash.replace(/^#/, '') : 'top10';
        var estado = { selecao: hash };
        var titulo = atualizaTela(estado);
        history.replaceState(estado, titulo, '#' + hash);
      } else {
        // Alguns navegadores chamam onload se o browser for reiniciado
        atualizaTela(history.state);
      }

      // Quando o usuário clica em voltar ou avançar
      window.onpopstate = function(e) {
        atualizaTela(e.state);
      };
    });
  });

})(jQuery, _, Highcharts);
