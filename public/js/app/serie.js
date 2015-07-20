(function(_, ipl) {
  'use strict';

  function GerenciadorDeCores(partidos, cores) {
    this.partidos      = partidos;
    this.cores         = cores || GerenciadorDeCores.CORES_PADRAO;
    this.pilhasDeCores = {};
    this.cache         = new ipl.Cache;
  }

  _.extend(GerenciadorDeCores.prototype, {

    proxima: function(cor) {
      // Inicia uma nova pilha de cores
      if (!(cor in this.pilhasDeCores)) {
        this.pilhasDeCores[cor] = [];
      }

      // Inicia um novo loop nas variantes da cor
      if (this.pilhasDeCores[cor].length === 0) {
        this.pilhasDeCores[cor] = this.cores[cor].slice();
      }

      // Pega uma variante da cor do partido
      return this.pilhasDeCores[cor].shift();
    },

    cor: function(partido) {
      var chave = partido.sigla + partido.numero + partido.fundado;
      if (!this.cache.has(chave)) {
        // Se o partido foi renomeado, usa a mesma cor do sucessor
        if (partido.renomeado != null) {
          var sucessor = this.partidos.buscarSucessor(partido);
          var corDoSucessor = this.cor(sucessor);
          this.cache.set(chave, corDoSucessor);
          return corDoSucessor;
        }
        // Retorna próxima cor da paleta
        var proximaCor = this.proxima(partido.cor);
        this.cache.set(chave, proximaCor);
        return proximaCor;
      }
      return this.cache.get(chave);
    },

  });

  GerenciadorDeCores.CORES_PADRAO = {
    verde:        [ 'green' ],
    vermelho:     [ 'red' ],
    laranja:      [ 'orange' ],
    azul:         [ 'blue' ],
    'azul claro': [ 'lightblue' ],
    roxo:         [ 'purple' ]
  };

  function GeradorDeSeries(configuracao, partidos, cores) {
    this.configuracao = configuracao;
    this.partidos     = partidos;
    this.cores        = cores;

    // Faz correções para gráficos em passos
    this.ehGraficoEmPassos = false;

    // Faz correções para gráficos de área
    this.ehGraficoDeArea   = false;
  }

  _.extend(GeradorDeSeries.prototype, {

    geraIndices: function(indice, regiao, anos, siglas) {
      return _.map(siglas, function(siglaENumero) {
        // Carrega informações do partido
        var info = _.find(this.partidos.todos(), function(p) {
          return siglaENumero === (p.sigla + p.numero);
        });
        // Calcula índices
        var indices = _.map(anos, function(ano) {
          return { ano: ano, indice: indice.calcula(regiao, ano, siglaENumero) };
        });
        return { info: info, indices: indices };
      }, this);
    },

    filtrarAnos: function(indicesPorSigla, manterNulls) {

      // Filtra anos que o partido existe
      var partidos = _.map(indicesPorSigla, function(p) {

        var indices = p.indices;

        if (manterNulls === true) {
          // No gráfico de área precisa de nulls nos anos que não tem dados
          indices = _.map(indices, function(ponto) {
            if (ponto.ano < p.fundado) {
              return { ano: ponto.ano, indice: null };
            }
            return ponto;
          });
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
        return _.assign(essencial, { indices: indices });
      });

      // Filtra partidos que não tem dados para nenhum ano
      partidos = _.filter(partidos, 'indices.length');

      return partidos;
    },

    inicializaCores: function() {
      // Inicia as cores de todos os partidos para garantir que sempre seja gerada a mesma cor
      _.each(this.partidos.todos(), this.cores.cor, this.cores);
    },

    formataParaHighchartsPorJurisdicao: function(indicesPorSigla) {

      var tabela = this.configuracao.tabelaDeReescrita;

      this.inicializaCores();

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(p) {

        // Converte anos em datas
        var indices = _.map(p.indices, function(ponto) {
          return { x: Date.UTC(ponto.ano + 1, 0, 1), y: ponto.indice * 100 };
        });

        // Ordena índices por data (Highcharts precisa deles ordenados)
        var indicesOrdenados = _.sortBy(indices, 'x');

        var partidos = p.info != null ? [ p.info ].concat(p.mesclados) : p.mesclados;
        var serie = { name: p.sigla, data: indicesOrdenados, partidos: partidos };

        // Resto
        if (tabela != null && p.sigla === tabela.resto) {
          serie.color = '#333';
          if (this.ehGraficoDeArea === false) { serie.dashStyle = 'dash'; }
          // Substitui null por 0 para mostrar resto em todos os anos
          serie.data = _.map(serie.data, function(ponto) {
            return { x: ponto.x, y: ponto.y || 0.0 };
          });
        } else {
          serie.color = this.cores.cor(p.info);
        }

        return serie;

      }, this);

      var todosOsPontos = _.flatten(_.pluck(indicesPorSigla, 'data'));
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

        // Mantem o resto em último (menor)
        if (tabela != null) {
          somaDosIndices += (tabela.resto === p.name) ? 0 : 9999;
        }

        return somaDosIndices;

      }, this).reverse();

      return series;

    },

    formataParaHighchartsPorAno: function(indicesPorSigla) {

      var tabela = this.configuracao.tabelaDeReescrita;

      this.inicializaCores();

      // Converte para formato esperado pelo Highcharts
      var series = _.map(indicesPorSigla, function(p) {

        var serie = {
          name: p.sigla,
          y:    p.indices[0].indice * 100
        };

        // Resto
        if (tabela != null && p.sigla === tabela.resto) {
          serie.color = '#333';
        } else {
          serie.color = this.cores.cor(p.info);
        }

        return serie;

      }, this);

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      series = _.sortBy(series, function(p) {

        var indice = p.y;

        // Mantem o resto em último (menor)
        if (tabela != null) {
          indice += (tabela.resto === p.name) ? 0 : 9999;
        }

        return indice;

      }).reverse();

      return [{
        type: 'pie',
        name: 'Índice',
        data: series
      }];

    },

    seriesPorJurisdicao: function(indice, regiao) {
      var anos = _.filter(_.uniq(indice.anos(regiao).sort(), true), function(ano) {
        return indice.temDados(regiao, ano);
      });
      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.ehGraficoEmPassos === true) {
        anos.push(_.max(anos) + 1);
      }
      var siglas = _.uniq(_.flatten(_.map(anos, function(ano) {
        return indice.series(regiao, ano);
      })).sort(), true);
      var partidos = this.geraIndices(indice, regiao, anos, siglas);
      partidos = this.configuracao.mapearPartidos(partidos);
      partidos = this.filtrarAnos(partidos, this.ehGraficoDeArea);
      var series = this.formataParaHighchartsPorJurisdicao(partidos);
      return series;
    },

    seriesPorAno: function(indice, regiao, filtroAno) {
      var ano = filtroAno - 1;
      if (indice.temDados(regiao, ano) === false) {
        return this.formataParaHighchartsPorAno([]);
      }
      var siglas = indice.series(regiao, ano);
      var partidos = this.geraIndices(indice, regiao, [ ano ], siglas);
      partidos = this.configuracao.mapearPartidos(partidos);
      partidos = this.filtrarAnos(partidos, this.ehGraficoDeArea);
      var series = this.formataParaHighchartsPorAno(partidos);
      return series;
    },

  });

  _.extend(ipl, /* @lends ipl */ {
    GerenciadorDeCores: GerenciadorDeCores,
    GeradorDeSeries: GeradorDeSeries
  });

}.call(this, _, ipl));
