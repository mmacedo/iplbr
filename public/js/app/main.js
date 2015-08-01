/* jshint browser: true */
/* globals ipl, _, jQuery, Highcharts, MathJax */

;(function(ipl, _, $, Highcharts, MathJax) {
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

  $.fn.selectpicker.defaults = {
    noneSelectedText:  'Nada selecionado',
    noneResultsText:   'Nada encontrado contendo {0}',
    countSelectedText: 'Selecionado {0} de {1}',
    maxOptionsText:    [
      'Limite excedido (máx. {n} {var})',
      'Limite do grupo excedido (máx. {n} {var})',
      [ 'itens', 'item' ]
    ],
    multipleSeparator: ', '
  };

  MathJax.Hub.Config({
    jax:                    [ "input/MathML", "output/HTML-CSS" ],
    extensions:             [],
    showProcessingMessages: false,
    showMathMenu:           false,
    showMathMenuMSIE:       false,
    "HTML-CSS": {
      linebreaks: { automatic: true }
    }
  });

  function atualizaConfiguracao(cfg, series, apenas0e100) {
    var partidos = ipl.filtroDePartidos();

    if (partidos === null) {
      cfg.mudancasDeNome = $('#mudancas_de_nome').is(':checked:enabled');
      cfg.incorporacoes  = $('#incorporacoes').is(':checked:enabled');
      cfg.fusoes         = $('#fusoes').is(':checked:enabled');
      cfg.tabelaDeReescrita = null;
    } else {
      cfg.mudancasDeNome    = partidos.partido != null;
      cfg.incorporacoes     = false;
      cfg.fusoes            = false;

      if (partidos.selecao != null) {
        cfg.tabelaDeReescrita = ipl.ConfiguracaoDePartidos[partidos.selecao];
      } else {
        cfg.tabelaDeReescrita = null;
      }
    }

    if (apenas0e100 === true) {
      series.ehGraficoEmPassos = true;
      series.ehGraficoDeArea   = true;
    } else {
      series.ehGraficoEmPassos = $('#passos').is(':checked:enabled');
      series.ehGraficoDeArea   = $('#tipo_area').is(':checked');
    }
  }

  function atualizaTela(estado) {
    var valor = estado.partidos === 'todos' ?
      'todos' :
      estado.partidos.match(/^(top10|top3|antigos)$/) ?
      'selecao-' + estado.partidos :
      estado.partidos.match(/^[a-z]{2,}[0-9]{2}$/) ?
      'partido-' + estado.partidos :
      null;
    fazerMudancas(function() {
      $('#partidos').selectpicker('val', valor).change();
      if (valor === 'todos') {
        $('#mudancas_de_nome').prop('checked', true);
        $('#incorporacoes, #fusoes').prop('checked', false);
      }
    });
    return $('#partidos [value="' + valor + '"]').text();
  }

  function adicionaHistoria() {
    if (window.fazendoMudancas === true) {
      return;
    }
    var filtro = ipl.filtroDePartidos();
    var partidos = filtro ? filtro.selecao || filtro.partido : 'todos';
    var titulo  = $('#partidos :selected').text();
    history.pushState({ partidos: partidos }, titulo, '#' + partidos);
  }

  function atualizaGuia() {
    if (window.fazendoMudancas === true) {
      return;
    }
    if ($('#painel_grafico_partido').hasClass('in')) {
      $('#painel_grafico_partido').trigger('shown.ipl');
    } else {
      $('#tablist_graficos > li.active > a[data-toggle="tab"]').trigger('shown.bs.tab');
    }
  }

  function fazerMudancas(mudancas) {
    window.fazendoMudancas = true;
    mudancas();
    window.fazendoMudancas = false;
    atualizaGuia();
  }

  $(function() {

    // Esconde tipo de gráfico quando o ano for selecionado (apenas torta)
    $(document).on('change', '#ano', function() {
      if ($('#ano').val() === 'todos') {
        $('#painel_tipo_de_grafico').addClass('in');
      } else {
        $('#painel_tipo_de_grafico').removeClass('in');
      }
    });

    // Esconde painel de mesclagem quando o partido for selecionado
    $(document).on('change', '#partidos', function() {
      if ($('#partidos').val() === 'todos') {
        $('#painel_mesclagem').addClass('in');
      } else {
        $('#painel_mesclagem').removeClass('in');
      }
    });

    $(document).on('change', '#ano, #partidos', function() {
      if ($('#ano').val() !== 'todos' && _.startsWith($('#partidos').val(), 'partido-')) {
        $('#painel_graficos').removeClass('in');
        $('#painel_grafico_partido').addClass('in');
      } else {
        $('#painel_graficos').addClass('in');
        $('#painel_grafico_partido').removeClass('in');
      }
    });

    // Desabilita 'Em passos' quando o tipo de gráfico não permitir isso
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

    $(document).on('change', '.campo-configuracao', function(e) {
      // Não recria quando digita no Live Search do Bootstrap Select
      if ($(e.currentTarget).is('.bootstrap-select')) {
        return;
      }
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
      var idPainel = $(this).attr('aria-controls');
      $('#' + idPainel + ' [data-highcharts-chart]').each(function() {
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
        roxo:         [ '#be55d9', '#7e80ed', '#996699' ]
      });
      var series = new ipl.GeradorDeSeries(cfg, partidos, cores);

      $(document).on('shown.bs.tab', '[aria-controls="tab_indice_total"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.indice();
        ipl.criaGrafico('#indice_total', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_total"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.legislativo();
        ipl.criaGrafico('#legislativo_total', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_total"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.executivo();
        ipl.criaGrafico('#executivo_total', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_indice_federal"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.federal();
        ipl.criaGrafico('#indice_federal', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_federal"]', function() {
        atualizaConfiguracao(cfg, series);
        var indiceCamara = indices.deputadosFederais();
        ipl.criaGrafico('#deputados_federais', series, indiceCamara);
        var indiceSenado = indices.senadores();
        ipl.criaGrafico('#senadores', series, indiceSenado);
        var indiceCongresso = indices.legislativoFederal();
        ipl.criaGrafico('#congresso_nacional', series, indiceCongresso);
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_federal"]', function() {
        atualizaConfiguracao(cfg, series, true);
        var indice = indices.executivoFederal();
        ipl.criaGrafico('#presidentes', series, indice, true);
      }).on('shown.bs.tab', '[aria-controls="tab_indice_estadual"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.estadual();
        ipl.criaGrafico('#indice_estadual', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_estadual"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.legislativoEstadual();
        ipl.criaGrafico('#deputados_estaduais', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_estadual"]', function() {
        var apenasUmaUf = ipl.filtroPorRegiao().ues.length === 1;
        atualizaConfiguracao(cfg, series, apenasUmaUf);
        var indice = indices.executivoEstadual();
        ipl.criaGrafico('#governadores', series, indice, apenasUmaUf);
      }).on('shown.bs.tab', '[aria-controls="tab_indice_municipal"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.municipal();
        ipl.criaGrafico('#indice_municipal', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_legislativo_municipal"]', function() {
        atualizaConfiguracao(cfg, series);
        var indice = indices.legislativoMunicipal();
        ipl.criaGrafico('#vereadores', series, indice);
      }).on('shown.bs.tab', '[aria-controls="tab_executivo_municipal"]', function() {
        var ues = ipl.filtroPorRegiao().ues;
        var apenasDf = ues.length === 1 && ues[0] === 'DF';
        atualizaConfiguracao(cfg, series, apenasDf);
        var indice = indices.executivoMunicipal();
        ipl.criaGrafico('#prefeitos', series, indice, apenasDf);
      }).on('shown.bs.tab', '[aria-controls="tab_total"]', function() {
        $('#tablist_total > li.active > a[data-toggle="tab"]')
          .trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_federal"]', function() {
        $('#tablist_federal > li.active > a[data-toggle="tab"]')
          .trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_estadual"]', function() {
        $('#tablist_estadual > li.active > a[data-toggle="tab"]')
        .trigger('shown.bs.tab');
      }).on('shown.bs.tab', '[aria-controls="tab_municipal"]', function() {
        $('#tablist_municipal > li.active > a[data-toggle="tab"]')
          .trigger('shown.bs.tab');
      });

      $(document).on('shown.ipl', '#painel_grafico_partido', function() {
        atualizaConfiguracao(cfg, series);
        var indiceFederal   = indices.federal();
        var indiceEstadual  = indices.estadual();
        var indiceMunicipal = indices.municipal();
        ipl.criaGraficoRadar('#grafico_partido', series, indiceFederal, indiceEstadual, indiceMunicipal);
      });

      if (history.state == null) {
        // Primeiro carregamento da tela
        var hash   = window.location.hash ? window.location.hash.replace(/^#/, '') : 'top10';
        var estado = { partidos: hash };
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

})(ipl, _, jQuery, Highcharts, MathJax);
