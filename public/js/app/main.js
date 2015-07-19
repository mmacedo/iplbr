/* jshint browser: true */
/* globals jQuery, Highcharts */

(function($, _, Highcharts, ipl) {
  'use strict';

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

  function atualizaConfiguracao(cfg, series, apenas0e100) {
    cfg.mudancasDeNome    = $('#mudancas_de_nome').is(':checked:enabled');
    cfg.incorporacoes     = $('#incorporacoes').is(':checked:enabled');
    cfg.fusoes            = $('#fusoes').is(':checked:enabled');

    if ($('#configuracao_todos').is(':checked')) {
      cfg.tabelaDeReescrita = null;
    } else if ($('#configuracao_top10').is(':checked')) {
      cfg.tabelaDeReescrita = ipl.ConfiguracaoDePartidos.top10;
    } else if ($('#configuracao_top3').is(':checked')) {
      cfg.tabelaDeReescrita = ipl.ConfiguracaoDePartidos.top3;
    } else if ($('#configuracao_antigos').is(':checked')) {
      cfg.tabelaDeReescrita = ipl.ConfiguracaoDePartidos.partidosAntigos;
    }

    series.ehGraficoEmPassos = apenas0e100 === true || $('#passos').is(':checked:enabled');
    series.ehGraficoDeArea   = apenas0e100 === true || $('#tipo_area').is(':checked');
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

  function atualizaGuia() {

    if (window.fazendoMudancas === true) {
      return;
    }

    $('#tablist_graficos > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');

  }

  function fazerMudancas(mudancas) {
    window.fazendoMudancas = true;
    mudancas();
    window.fazendoMudancas = false;
    atualizaGuia();
  }

  $(function() {

    // Restaura configurações de partidos
    $(document).on('click', '#cfg_partidos > a.cfg_remover', function() {
      fazerMudancas(function() {
        $('#configuracao_todos').trigger('click');
        $('#mudancas_de_nome').prop('checked', true);
        $('#incorporacoes, #fusoes').prop('checked', false);
      });
      adicionaHistoria();
      return false;
    });

    // Esconde link para remover configurãção quando expandir o painel
    $(document).on('show.bs.collapse', '#panel_cfg_partidos', function() {
      $('#cfg_partidos').hide();
    }).on('hidden.bs.collapse', '#panel_cfg_partidos', function() {
      if ($('#cfg_partidos > .cfg_label').text() !== '') {
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
    $(document).on('change', '.cfg.cfg-indice', function() {
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
          .addClass('disabled');
      } else {
        $('#passos')
          .prop('disabled', false)
          .closest('.checkbox')
          .removeClass('disabled');
      }
    });

    // Precisa atualizar séries (remove série e readiciona)
    $(document).on('change', '.cfg.cfg-indice', function() {
      adicionaHistoria();
      atualizaGuia();
    });

    // Precisa atualizar séries (destrói gráfico e recria)
    $(document).on('change', '.cfg.cfg-grafico', function() {
      adicionaHistoria();

      // Destrói todos os gráficos (update tá com bug quando muda para tipo area)
      _.each(Highcharts.charts.slice(), function(chart) {
        if (chart != null) {
          chart.destroy();
        }
      });

      atualizaGuia();
    });

    // Redesenha gráficos que estavam em elementos escondidos
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function() {
      var panel_id = $(this).attr('aria-controls');
      $('#' + panel_id + ' [data-highcharts-chart]').each(function() {
        $(this).highcharts().redraw();
        $(this).highcharts().reflow();
      });
    });

    $.getJSON('eleitos.json').done(function(json) {
      var eleicoes = new ipl.RepositorioEleitoral(json);
      var indices  = new ipl.FabricaDeIndices(eleicoes);

      var partidos = new ipl.RepositorioDePartidos();
      var cfg = new ipl.ConfiguracaoDePartidos(partidos);
      var cores = new ipl.GerenciadorDeCores(partidos, {
        verde:        [ '#6ed854', '#a9ff97', '#00ff99' ],
        vermelho:     [ '#df5353', '#e86850', '#dc143c', '#ed7db7' ],
        laranja:      [ '#f7a35c', '#edb47e' ],
        azul:         [ '#7cb5ec', '#3366cc', '#90b1d8', '#6699ff' ],
        'azul claro': [ '#7eedeb', '#00ced1' ],
        roxo:         [ '#be55d9', '#7e80ed', '#996699' ],
      });
      var series = new ipl.GeradorDeSeries(cfg, partidos, cores);

      $(document).on('shown.bs.tab', '[aria-controls="tab_indice_total"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#indice_total', series, indices.indice());
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_total"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#legislativo_total', series, indices.legislativo());
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_total"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#executivo_total', series, indices.executivo());
      }).on('shown.bs.tab', '[aria-controls="tab_indice_federal"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#indice_federal', series, indices.federal());
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_federal"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#deputados_federais', series, indices.deputadosFederais());
        ipl.criaGrafico('#senadores', series, indices.senadores());
        ipl.criaGrafico('#congresso_nacional', series, indices.legislativoFederal());
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_federal"]', function() {
        atualizaConfiguracao(cfg, series, true);
        ipl.criaGrafico('#presidentes', series, indices.executivoFederal(), true);
      }).on('shown.bs.tab', '[aria-controls="tab_indice_estadual"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#indice_estadual', series, indices.estadual());
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_estadual"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#deputados_estaduais', series, indices.legislativoEstadual());
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_estadual"]', function() {
        var estaMostrandoApenasUmaUf = ipl.filtroJurisdicao().ues.length === 1;
        atualizaConfiguracao(cfg, series, estaMostrandoApenasUmaUf);
        ipl.criaGrafico('#governadores', series, indices.executivoEstadual(), estaMostrandoApenasUmaUf);
      }).on('shown.bs.tab', '[aria-controls="tab_indice_municipal"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#indice_municipal', series, indices.municipal());
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_municipal"]', function() {
        atualizaConfiguracao(cfg, series);
        ipl.criaGrafico('#vereadores', series, indices.legislativoMunicipal());
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_municipal"]', function() {
        var ues = ipl.filtroJurisdicao().ues, estaMostrandoApenasDf = ues.length === 1 && ues[0] === 'DF';
        atualizaConfiguracao(cfg, series, estaMostrandoApenasDf);
        ipl.criaGrafico('#prefeitos', series, indices.executivoMunicipal(), estaMostrandoApenasDf);
      }).on('shown.bs.tab', '[aria-controls="tab_total"]', function() {
        $('#tablist_total > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_federal"]', function() {
        $('#tablist_federal > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_estadual"]', function() {
        $('#tablist_estadual > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_municipal"]', function() {
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

})(jQuery, _, Highcharts, ipl);
