/* globals _, Configuracao */

(function(_, Configuracao) {
  'use strict';

  function GerenciadorDeCores(cores) {
    this.cores             = cores;
    this._pilhaDeCores     = {};
    this._coresDosPartidos = {};
  }

  _.extend(GerenciadorDeCores.prototype, {

    proxima: function(cor) {
      // Inicia uma nova pilha de cores
      if (!(cor in this._pilhaDeCores)) {
        this._pilhaDeCores[cor] = [];
      }

      // Inicia um novo loop nas variantes da cor
      if (this._pilhaDeCores[cor].length === 0) {
        this._pilhaDeCores[cor] = this.cores[cor].slice();
      }

      // Pega uma variante da cor do partido
      return this._pilhaDeCores[cor].shift();
    },

    cor: function(partido) {

      var chave = partido.sigla + partido.numero + '_' + partido.fundado;

      // Retorna cor se já tem uma
      if (chave in this._coresDosPartidos) {
        return this._coresDosPartidos[chave];
      }

      // Se o partido foi renomeado, usa a mesma cor do sucessor
      if (partido.renomeado != null) {
        var sucessor = Configuracao.encontraPartidoSucessor(partido);
        return (this._coresDosPartidos[chave] = this.cor(sucessor));
      }

      // Retorna próxima cor da paleta
      return (this._coresDosPartidos[chave] = this.proxima(partido.cor));
    },

  });

  function Serie(configuracao) {
    this.configuracao = configuracao;
    this.cores        = new GerenciadorDeCores(configuracao.cores);

    // Inicia as cores de todos os partidos para evitar que sejam gerados cores diferentes toda vez
    _.each(Configuracao.partidos, _.bind(this.cores.cor, this.cores));
  }

  _.extend(Serie.prototype, {

    geraIndices: function(indice, anos, ufs) {

      var cfg = this.configuracao;

      // Calcula para cada partido os índices por ano
      var indicesPorSigla = _.map(indice.siglas(anos, ufs), function(siglaENumero) {

        // Carrega informações do partido
        var info = _.find(Configuracao.partidos, function(info) {
          return siglaENumero === (info.sigla + info.numero.toString());
        });

        // Adiciona todos anos necessários
        var anosParaCalcular = cfg.anosComIndice(anos, info.fundado, info.extinto, true);

        // Calcula índices
        var indicePorAno = _.map(anosParaCalcular, function(ano) {
          return { ano: ano, indice: indice.calculaIndice(ano, ufs, siglaENumero) };
        });

        // Extrai siglas e números dos partidos
        var matches = siglaENumero.match(/(.*?)([0-9]{2})/);
        var sigla = matches[1], numero = +matches[2];

        return { sigla: sigla, numero: numero, indices: indicePorAno, info: info };

      });

      return indicesPorSigla;

    },

    aplicaConfiguracoes: function(anosComDados, indicesPorSigla) {

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

        var essencial = _.pick(p, [ 'sigla', 'info', 'mesclados' ]);
        return _.assign(essencial, { indices: indicesPorAno });

      });

      // Filtra partidos que não tem dados para nenhum ano
      dados = _.filter(dados, 'indices.length');

      return dados;

    },

    formataParaHighchartsPorJurisdicao: function(indicesPorSigla) {

      var cfg = this.configuracao, tabela = cfg.tabelaDeReescrita, cores = this.cores;

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(p) {

        // Converte anos em datas
        var indices = _.map(p.indices, function(ponto) {
          return { x: Date.UTC(ponto.ano + 1, 0, 1), y: ponto.indice };
        });

        // Ordena índices por data (Highcharts precisa deles ordenados)
        var indicesOrdenados = _.sortBy(indices, 'x');

        var partidos = p.info != null ? [ p.info ].concat(p.mesclados) : p.mesclados;
        var serie = { name: p.sigla, data: indicesOrdenados, partidos: partidos };

        // Resto
        if (tabela != null && p.sigla === tabela.resto) {
          serie.color = '#333';
          if (cfg.ehGraficoDeArea === false) { serie.dashStyle = 'dash'; }
          // Substitui null por 0 para mostrar resto em todos os anos
          serie.data = _.map(serie.data, function(ponto) {
            return { x: ponto.x, y: ponto.y || 0.0 };
          });
        } else {
          serie.color = cores.cor(p.info);
        }

        return serie;

      });

      var todosOsPontos = _.flatten(_.pluck(indicesPorSigla, 'data'));
      var ultimoAno = _.max(_.pluck(todosOsPontos, 'x'));

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(p) {

        var somaDosIndices = _.reduce(p.data, function(total, ponto) {
          // Não soma último ano se ele foi adicionado porque é gráfico em passos
          if (cfg.ehGraficoEmPassos === true && ponto.x === ultimoAno) {
            return total;
          }
          return total + ponto.y;
        }, 0);

        // Mantem o resto em último (menor)
        if (tabela != null) {
          somaDosIndices += (tabela.resto === p.name) ? 0 : 9999;
        }

        return somaDosIndices;

      }).reverse();

      return series;

    },

    formataParaHighchartsPorAno: function(indicesPorSigla) {

      var tabela = this.configuracao.tabelaDeReescrita, cores = this.cores;

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(linha) {

        var serie = {
          name: linha.sigla,
          y:    linha.indices[0].indice
        };

        // Resto
        if (tabela != null && linha.sigla === tabela.resto) {
          serie.color = '#333';
        } else {
          serie.color = cores.cor(linha.info);
        }

        return serie;

      });

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(linha) {

        var indice = linha.y;

        // Mantem o resto em último (menor)
        if (tabela != null) {
          indice += (tabela.resto === linha.name) ? 0 : 9999;
        }

        return indice;

      }).reverse();

      return [{
        type: 'pie',
        name: 'Índice',
        data: series
      }];

    },

    seriesPorJurisdicao: function(indice, ufs) {

      var anos = _.uniq(_.flatten(_.map(ufs, _.bind(indice.anos, indice)))).sort();

      // Filtra anos que não tem dados (ex.: anos sem todos os senadores)
      var anosComDados = _.filter(anos, function(ano) {
        return indice.temDados(ano, ufs);
      });

      var indicesPorSigla = this.geraIndices(indice, anosComDados, ufs);
      var indicesMigrados = this.aplicaConfiguracoes(anosComDados, indicesPorSigla);
      var series = this.formataParaHighchartsPorJurisdicao(indicesMigrados);

      return series;

    },

    seriesPorAno: function(indice, ufs, filtroAno) {

      var ano = filtroAno - 1, series;

      if (indice.temDados(ano, ufs)) {
        var indicesPorSigla = this.geraIndices(indice, [ano], ufs);
        var indicesMigrados = this.aplicaConfiguracoes([ano], indicesPorSigla);
        series = this.formataParaHighchartsPorAno(indicesMigrados);
      } else {
        series = this.formataParaHighchartsPorAno([]);
      }

      return series;

    },

  });

  this.GerenciadorDeCores = GerenciadorDeCores;
  this.Serie = Serie;

}.call(this, _, Configuracao));
