/* globals _, Configuracao */

(function(_, Configuracao) {
  'use strict';

  function GerenciadorDeCores(cores) {
    this.cores             = cores;
    this._pilhaDeCores     = {};
    this._coresDosPartidos = {};
  }

  GerenciadorDeCores.prototype.cor = function(partido) {

    var chave = partido.sigla + partido.numero.toString() + '_' + partido.fundado.toString();

    // Se for primeira vez, acha a cor do partido
    if (!(chave in this._coresDosPartidos)) {

      // Mantém a mesma cor se o partido foi renomeado
      if (partido.renomeado != null) {
        var sucessor = Configuracao.encontraPartidoSucessor(partido);
        this._coresDosPartidos[chave] = this.cor(sucessor);
      } else {

        // Inicia uma nova pilha de cores
        if (!(partido.cor in this._pilhaDeCores)) {
          this._pilhaDeCores[partido.cor] = [];
        }

        // Inicia um novo loop nas variantes da cor
        if (this._pilhaDeCores[partido.cor].length === 0) {
          this._pilhaDeCores[partido.cor] = this.cores[partido.cor].slice();
        }

        // Pega uma variante da cor do partido
        this._coresDosPartidos[chave] = this._pilhaDeCores[partido.cor].shift();
      }

    }

    return this._coresDosPartidos[chave];
  };

  function Serie(configuracao) {
    this.configuracao = configuracao;
    this.cores        = new GerenciadorDeCores(configuracao.cores);

    // Inicia as cores de todos os partidos para evitar que sejam gerados cores diferentes toda vez
    _.each(Configuracao.partidos, _.bind(this.cores.cor, this.cores));
  }

  Serie.prototype.geraIndices = function(indice, anos, ufs) {

    var _this = this;

    // Calcula para cada partido os índices por ano
    var indicesPorSigla = _.map(indice.siglas(anos, ufs), function(siglaENumero) {

      // Carrega informações do partido
      var info = _.find(Configuracao.partidos, function(info) {
        return siglaENumero === (info.sigla + info.numero.toString());
      });

      // Adiciona todos anos necessários
      var anosParaCalcular = _this.configuracao.anosComIndice(anos, info.fundado, info.extinto, true);

      // Calcula índices
      var indicePorAno = _.map(anosParaCalcular, function(ano) {
        return { ano: ano, indice: indice.calculaIndice(ano, ufs, siglaENumero) };
      });

      // Extrai siglas e números dos partidos
      var matches = siglaENumero.match(/(.*?)([0-9]{2})/);
      var sigla = matches[1], numero = parseInt(matches[2], 10);

      return { sigla: sigla, numero: numero, indices: indicePorAno, info: info };

    });

    return indicesPorSigla;

  };

  Serie.prototype.aplicaConfiguracoes = function(anosComDados, indicesPorSigla) {

    var cfg = this.configuracao;

    // Aplica configuração de partidos (parte 1)
    var dados = cfg.mesclarPartidosExtintos(indicesPorSigla);

    // Aplica configuração de partidos (parte 2)
    dados = cfg.reescreverSiglas(dados);

    // Filtra anos que o partido existe
    dados = _.map(dados, function(p) {

      var anos = cfg.anosComIndice(anosComDados, p.fundado, p.extinto, false);

      var indicesPorAno = _.map(anos, function(ano) {
        if (cfg.ehGraficoDeArea === true && ano < p.fundado) {
          return { ano: ano, indice: null };
        } else {
          return _.find(p.indices, 'ano', ano);
        }
      });

      return _.assign({}, p, { indices: indicesPorAno });

    });

    // Filtra partidos que não tem dados para nenhum ano
    dados = _.filter(dados, 'indices.length');

    return dados;

  };

  Serie.prototype.formataParaHighchartsPorJurisdicao = function(indicesPorSigla) {

    var _this = this;

    // Converte para formato esperado pelo Highcharts
    var series = _.map(indicesPorSigla, function(linha) {

      // Converte anos em datas
      var indices = _.map(linha.indices, function(ponto) {
        return { x: Date.UTC(ponto.ano + 1, 0, 1), y: ponto.indice };
      });

      // Ordena índices por data (Highcharts precisa deles ordenados)
      var indicesOrdenados = _.sortBy(indices, function(ponto) { return ponto.x; });

      var serie = { name: linha.sigla, data: indicesOrdenados, partido: linha.info, outros: linha.mesclados };

      // Resto
      if (_this.configuracao.tabelaDeReescrita != null && linha.sigla === _this.configuracao.tabelaDeReescrita.resto) {
        serie.color = '#333';
        if (_this.configuracao.ehGraficoDeArea === false) { serie.dashStyle = 'dash'; }
        // Substitui null por 0 para mostrar resto em todos os anos
        serie.data = _.map(serie.data, function(ponto) { return { x: ponto.x, y: ponto.y || 0.0 }; });
      } else {
        serie.color = _this.cores.cor(linha.info);
      }

      return serie;

    });

    // Não soma último ano se ele foi adicionado porque é gráfico em passos
    var ultimoAno = _.max(_.flatten(_.map(indicesPorSigla, function(linha) {
      return _.map(linha.data, function(ponto) {
        return new Date(ponto.x).getFullYear();
      });
    })));
    var naoSomarAno = this.configuracao.ehGraficoEmPassos ? ultimoAno : null;

    // Ordena pela "importância do partido", isto é, a soma de todos os índices
    series = _.sortBy(series, function(linha) {

      var somaDosIndices = _.reduce(linha.data, function(total, ponto) {
        return total + (naoSomarAno && naoSomarAno === new Date(ponto.x).getFullYear() ? 0 : ponto.y);
      }, 0);

      // Mantem o resto em último (menor)
      if (_this.configuracao.tabelaDeReescrita != null) {
        somaDosIndices += (_this.configuracao.tabelaDeReescrita.resto === linha.name) ? 0 : 9999;
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
        y:    linha.indices[0].indice
      };

      // Resto
      if (_this.configuracao.tabelaDeReescrita != null && linha.sigla === _this.configuracao.tabelaDeReescrita.resto) {
        serie.color = '#333';
      } else {
        serie.color = _this.cores.cor(linha.info);
      }

      return serie;

    });

    // Ordena pela "importância do partido", isto é, a soma de todos os índices
    series = _.sortBy(series, function(linha) {

      var indice = linha.y;

      // Mantem o resto em último (menor)
      if (_this.configuracao.tabelaDeReescrita != null) {
        indice += (_this.configuracao.tabelaDeReescrita.resto === linha.name) ? 0 : 9999;
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

    var anos = _.uniq(_.flatten(_.map(ufs, function(uf) { return indice.anos(uf); }))).sort();

    // Filtra anos que não tem dados (ex.: anos sem todos os senadores)
    var anosComDados = _.filter(anos, function(ano) {
      return indice.temDados(ano, ufs);
    });

    var indicesPorSigla = this.geraIndices(indice, anosComDados, ufs);
    var indicesMigrados = this.aplicaConfiguracoes(anosComDados, indicesPorSigla);
    var series = this.formataParaHighchartsPorJurisdicao(indicesMigrados);

    return series;

  };

  Serie.prototype.seriesPorAno = function(indice, ufs, filtroAno) {

    var ano = filtroAno - 1, series;

    if (indice.temDados(ano, ufs)) {
      var indicesPorSigla = this.geraIndices(indice, [ano], ufs);
      var indicesMigrados = this.aplicaConfiguracoes([ano], indicesPorSigla);
      series = this.formataParaHighchartsPorAno(indicesMigrados);
    } else {
      series = this.formataParaHighchartsPorAno([]);
    }

    return series;

  };

  this.GerenciadorDeCores = GerenciadorDeCores;
  this.Serie = Serie;

}.call(this, _, Configuracao));
