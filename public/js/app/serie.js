"use strict";

(function(_) {

  window.Serie = (function() {

    function Serie(configuracao) {
      this.configuracao = configuracao;
    }

    Serie.prototype.geraIndices = function(indice, anos, ufs) {

      var _this = this;

      // Calcula para cada partido os índices por ano
      var indicesPorSigla = _.map(indice.siglas(ufs, anos), function(sigla) {

        // Carrega informações do partido
        var info = _.find(Configuracao.partidos, function(info) {
          return sigla === (info.sigla + info.numero.toString());
        });

        // Adiciona todos anos necessários
        var anosParaCalcular = _this.configuracao.anosComIndice(anos, info.fundado, info.extinto, true);

        // Calcula índices
        var indicePorAno = _.map(anosParaCalcular, function(ano) {
          return [ ano, indice.calculaIndice(ano, ufs, sigla) ];
        });

        // Extrai siglas e números dos partidos
        var matches = sigla.match(/(.*?)([0-9]{2})/);
        var sigla = matches[1], numero = parseInt(matches[2], 10);

        return { sigla: sigla, numero: numero, indices: indicePorAno };

      });

      return indicesPorSigla;

    };

    Serie.prototype.aplicaConfiguracoes = function(anosComDados, indicesPorSigla) {

      var _this = this;

      // Aplica configuração de partidos (parte 1)
      var indicesPorSigla = _this.configuracao.mesclarPartidosExtintos(indicesPorSigla);

      // Filtra anos que o partido existe
      indicesPorSigla = _.map(indicesPorSigla, function(partido) {

        var anos = _this.configuracao.anosComIndice(anosComDados, partido.fundado, partido.extinto, false);

        var indicesPorAno = _.map(anos, function(ano) {
          var indice = _.find(partido.indices, function(i) { return ano === i[0] })[1];
          return [ ano, indice ];
        });

        return { sigla: partido.sigla, numero: partido.numero, indices: indicesPorAno };

      });

      // Aplica configuração de partidos (parte 2)
      indicesPorSigla = _this.configuracao.reescreverSiglas(indicesPorSigla);

      // Filtra partidos que não tem dados para nenhum ano
      indicesPorSigla = _.filter(indicesPorSigla, function(p) { return p.indices.length > 0 });

      return indicesPorSigla;

    };

    Serie.prototype.formataParaHighchartsPorJurisdicao = function(indicesPorSigla) {

      var _this = this;

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(linha) {

        // Converte anos em datas
        var indices = _.map(linha.indices, function(tupla) {
          var ano = tupla[0], indice = tupla[1];
          return [ Date.UTC(ano + 1, 0, 1), indice ];
        });

        // Ordena índices por data (Highcharts precisa deles ordenados)
        var indicesOrdenados = _.sortBy(indices, function(linha) { return linha[0] });

        var serie = { name: linha.sigla, data: indicesOrdenados };

        // Resto
        if (_this.configuracao.tabelaDeReescrita != null && linha.sigla === _this.configuracao.tabelaDeReescrita.resto) {
          serie.color = '#333';
          if (_this.configuracao.ehGraficoArea === false) { serie.dashStyle = 'dash'; }
        }

        return serie;

      });

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(linha) {

        var somaDosIndices = _.reduce(linha.data, function(memo, i) { return memo + i[1] }, 0);

        // Mantem o resto em último (menor)
        if (_this.configuracao.tabelaDeReescrita != null) {
          somaDosIndices += (_this.configuracao.tabelaDeReescrita.resto == linha.name) ? 0 : 9999;
        }

        return somaDosIndices;

      }).reverse();

      return series;

    };

    Serie.prototype.formataParaHighchartsPorAno = function(indicesPorSigla) {

      var _this = this;

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(linha) {

        var serie = {
          name: linha.sigla,
          y:    linha.indices[0][1]
        };

        // Resto
        if (_this.configuracao.tabelaDeReescrita != null && linha.sigla === _this.configuracao.tabelaDeReescrita.resto) {
          serie.color = '#333';
        }

        return serie;

      });

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(linha) {

        var indice = linha.y;

        // Mantem o resto em último (menor)
        if (_this.configuracao.tabelaDeReescrita != null) {
          indice += (_this.configuracao.tabelaDeReescrita.resto == linha.name) ? 0 : 9999;
        }

        return indice;

      }).reverse();

      return [{
        type: 'pie',
        name: 'Índice',
        data: series
      }];

    };

    Serie.prototype.seriesPorJurisdicao = function(indice, ufs) {

      var _this = this;

      // Filtra anos que não tem dados (ex.: anos sem todos os senadores)
      var anosComDados = _.filter(indice.anos(), function(ano) {
        return indice.temDados(ano, ufs);
      });

      var indicesPorSigla = this.geraIndices(indice, anosComDados, ufs);
      var indicesMigrados = this.aplicaConfiguracoes(anosComDados, indicesPorSigla);
      var series = this.formataParaHighchartsPorJurisdicao(indicesMigrados);

      return series;

    };

    Serie.prototype.seriesPorAno = function(indice, ufs, ano) {

      var ano = ano - 1, series;

      if (indice.temDados(ano, ufs)) {
        var indicesPorSigla = this.geraIndices(indice, [ano], ufs);
        var indicesMigrados = this.aplicaConfiguracoes([ano], indicesPorSigla);
        series = this.formataParaHighchartsPorAno(indicesMigrados);
      } else {
        series = this.formataParaHighchartsPorAno([]);
      }

      return series;

    };

    return Serie;

  })();

})(_);
