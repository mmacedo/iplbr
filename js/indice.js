;(function() {

  // Realiza herança, copiado do CoffeeScript
  var _extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  // Para função map, converte todos os itens para inteiros
  var toInt = function(s) {
    return parseInt(s, 10);
  };

  window.Configuracao = (function() {

    function Configuracao() {
      this.passos         = false;
      this.mudancasDeNome = true;
      this.incorporacoes  = true;
      this.fusoes         = true;

      // Deixa gráficos de linha mais bonitos, mas estraga gráficos empilhados
      this.mostraFundacaoEDissolucao = true;

      // Ex.: Configuracao.tabelaDePartidosAntigos
      this.tabelaDeReescrita = null;

      // Faz correções específicas para gráficos de área
      this.ehGraficoArea = false;
    }

    Configuracao.regiaoSul         = [ 'PR', 'RS', 'SC' ];
    Configuracao.regiaoSudeste     = [ 'ES', 'MG', 'RJ', 'SP' ];
    Configuracao.regiaoCentroOeste = [ 'DF', 'GO', 'MS', 'MT' ];
    Configuracao.regiaoNorte       = [ 'AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO' ];
    Configuracao.regiaoNordeste    = [ 'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE' ];

    Configuracao.tabelaDeUfs = Lazy([
      Configuracao.regiaoSul,
      Configuracao.regiaoSudeste,
      Configuracao.regiaoCentroOeste,
      Configuracao.regiaoNorte,
      Configuracao.regiaoNordeste
    ]).flatten().sort().toArray();

    Configuracao.tabelaDePartidos = [
      { sigla: 'PRB',     numero: 10, fundado: 2005 },
      { sigla: 'PPR',     numero: 11, fundado: 1993, extinto: 1995, fusao: 'PPB' },
      { sigla: 'PPB',     numero: 11, fundado: 1995, extinto: 2003, renomeado: 'PP' },
      { sigla: 'PP',      numero: 11, fundado: 2003 },
      { sigla: 'PDT',     numero: 12, fundado: 1979 },
      { sigla: 'PT',      numero: 13, fundado: 1980 },
      { sigla: 'PTB',     numero: 14, fundado: 1980 },
      { sigla: 'PMDB',    numero: 15, fundado: 1980 },
      { sigla: 'PSTU',    numero: 16, fundado: 1993 },
      { sigla: 'PTRB',    numero: 17, fundado: 1993, extinto: 1995, renomeado: 'PRTB' },
      { sigla: 'PSL',     numero: 17, fundado: 1994 },
      { sigla: 'PST',     numero: 18, fundado: 1996, extinto: 2003, incorporado: 'PL' },
      { sigla: 'PTN',     numero: 19, fundado: 1995 },
      { sigla: 'PSC',     numero: 20, fundado: 1985 },
      { sigla: 'PCB',     numero: 21, fundado: 1996 },
      { sigla: 'PL',      numero: 22, fundado: 1985, extinto: 2006, fusao: 'PR' },
      { sigla: 'PR',      numero: 22, fundado: 2006 },
      { sigla: 'PPS',     numero: 23, fundado: 1992 },
      { sigla: 'PFL',     numero: 25, fundado: 1988, extinto: 2007, renomeado: 'DEM' },
      { sigla: 'DEM',     numero: 25, fundado: 2007 },
      { sigla: 'PAN',     numero: 26, fundado: 1998, extinto: 2006, incorporado: 'PTB' },
      { sigla: 'PSDC',    numero: 27, fundado: 1997 },
      { sigla: 'PRTB',    numero: 28, fundado: 1997 },
      { sigla: 'PCO',     numero: 29, fundado: 1995 },
      { sigla: 'PGT',     numero: 30, fundado: 1995, extinto: 2003, incorporado: 'PL' },
      { sigla: 'PSN',     numero: 31, fundado: 1997, extinto: 2003, renomeado: 'PHS' },
      { sigla: 'PHS',     numero: 31, fundado: 2003 },
      { sigla: 'PMN',     numero: 33, fundado: 1984 },
      { sigla: 'PRN',     numero: 36, fundado: 1989, extinto: 2000, renomeado: 'PTC' },
      { sigla: 'PTC',     numero: 36, fundado: 2000 },
      { sigla: 'PP',      numero: 39, fundado: 1993, extinto: 1995, fusao: 'PPB' },
      { sigla: 'PSB',     numero: 40, fundado: 1988 },
      { sigla: 'PSD',     numero: 41, fundado: 1987, extinto: 2003, incorporado: 'PTB' },
      { sigla: 'PV',      numero: 43, fundado: 1993 },
      { sigla: 'PRP',     numero: 44, fundado: 1991 },
      { sigla: 'PSDB',    numero: 45, fundado: 1988 },
      { sigla: 'PSOL',    numero: 50, fundado: 2004 },
      { sigla: 'PEN',     numero: 51, fundado: 2011 },
      { sigla: 'PEN',     numero: 51, fundado: 2011 },
      { sigla: 'PPL',     numero: 54, fundado: 2009 },
      { sigla: 'PSD',     numero: 55, fundado: 2011 },
      { sigla: 'PRONA',   numero: 56, fundado: 1989, extinto: 2006, fusao: 'PR' },
      { sigla: 'PC do B', numero: 65, fundado: 1988 },
      { sigla: 'PT do B', numero: 70, fundado: 1989 },
      { sigla: 'SD',      numero: 77, fundado: 2013 },
      { sigla: 'PROS',    numero: 90, fundado: 2013 }
    ];

    Configuracao.tabelaTop10 = {
      mapear: [
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'PMDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'PSDB' },
        { de: { sigla: 'PSB',     numero: 40 }, para: 'PSB' },
        { de: { sigla: 'PFL',     numero: 25 }, para: 'DEM' },
        { de: { sigla: 'DEM',     numero: 25 }, para: 'DEM' },
        { de: { sigla: 'PP',      numero: 39 }, para: 'PP' },
        { de: { sigla: 'PPR',     numero: 11 }, para: 'PP' },
        { de: { sigla: 'PPB',     numero: 11 }, para: 'PP' },
        { de: { sigla: 'PP',      numero: 11 }, para: 'PP' },
        { de: { sigla: 'PSD',     numero: 55 }, para: 'PSD' },
        { de: { sigla: 'PL',      numero: 22 }, para: 'PR' },
        { de: { sigla: 'PRONA',   numero: 56 }, para: 'PR' },
        { de: { sigla: 'PR',      numero: 22 }, para: 'PR' },
        { de: { sigla: 'PDT',     numero: 12 }, para: 'PDT' },
        { de: { sigla: 'PTB',     numero: 14 }, para: 'PTB' },
      ],
      resto: 'Resto'
    };

    Configuracao.tabelaTop3 = {
      mapear: [
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'PMDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'PSDB' },
      ],
      resto: 'Resto'
    };

    Configuracao.tabelaDePartidosAntigos = {
      mapear: [
        { de: { sigla: 'PPR',     numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PPB',     numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PP',      numero: 11 }, para: 'ARENA' },
        { de: { sigla: 'PFL',     numero: 25 }, para: 'ARENA' },
        { de: { sigla: 'DEM',     numero: 25 }, para: 'ARENA' },
        { de: { sigla: 'PSD',     numero: 55 }, para: 'ARENA' },
        { de: { sigla: 'PMDB',    numero: 15 }, para: 'MDB' },
        { de: { sigla: 'PSDB',    numero: 45 }, para: 'MDB' },
        { de: { sigla: 'PT',      numero: 13 }, para: 'PT' },
        { de: { sigla: 'PSTU',    numero: 16 }, para: 'PT' },
        { de: { sigla: 'PSOL',    numero: 50 }, para: 'PT' },
        { de: { sigla: 'PCO',     numero: 29 }, para: 'PT' },
        { de: { sigla: 'PSB',     numero: 40 }, para: 'PSB' },
        { de: { sigla: 'PTB',     numero: 14 }, para: 'Antigo PTB' },
        { de: { sigla: 'PT do B', numero: 70 }, para: 'Antigo PTB' },
        { de: { sigla: 'PDT',     numero: 12 }, para: 'Antigo PTB' },
        { de: { sigla: 'SD',      numero: 77 }, para: 'Antigo PTB' },
        { de: { sigla: 'PCB',     numero: 21 }, para: 'PCB' },
        { de: { sigla: 'PPS',     numero: 23 }, para: 'PCB' },
        { de: { sigla: 'PC do B', numero: 65 }, para: 'PCB' },
        { de: { sigla: 'PPL',     numero: 54 }, para: 'PCB' }
      ],
      resto: 'Resto'
    };

    Configuracao.prototype.filtrarAnos = function(anos, fundado, extinto) {

      var anos = anos.map(toInt);

      // Adiciona um ano depois da última eleição para o último passo ficar visível
      if (this.passos === true) {
        anos = anos.concat([ anos.max() + 1 ]);
      }

      if (this.mostraFundacaoEDissolucao === true && this.tabelaDeReescrita == null) {

        // Partido novo
        if ((fundado - 1) > anos.min()) {

          // Remove anos antes da fundação
          anos = anos.filter(function(ano) {
            return ano >= fundado;
          });

          // Adiciona ano da fundação
          anos = anos.concat([ fundado - 1 ]);

        }

        // Partido morto
        if (extinto != null) {

          // Se o partido foi extinto antes do primeiro ano do gráfico
          if (extinto < anos.min()) {

            anos = Lazy([]);

          } else {

            // Remove anos depois da dissolução
            anos = anos.filter(function(ano) {
              return ano <= extinto;
            });

            // Adiciona ano da dissolução, normalmente iria até a última eleição
            if ((extinto - 1) > anos.max()) {
              anos = anos.concat([ extinto - 1 ]);
            }

          }

        }

      }

      return anos;

    }

    Configuracao.prototype.corrigirDados = function(dados) {

      var _this = this;
      var migrouUmPartido = false;

      // Realiza migrações
      var dadosCorrigidos = dados.map(function(partido) {

        var config = Lazy(Configuracao.tabelaDePartidos).find(function(config) {
          return partido.sigla  === config.sigla &&
                 partido.numero === config.numero;
        });

        var configDestino = config;

        // Apenas partidos extintos podem ser migrados
        if (config.extinto != null) {

          var mesclarCom = null;
          if (_this.mudancasDeNome === true && config.renomeado != null) {
            mesclarCom = config.renomeado;
          } else if (_this.incorporacoes === true && config.incorporado != null) {
            mesclarCom = config.incorporado;
          } else if (_this.fusoes === true && config.fusao != null) {
            mesclarCom = config.fusao;
          }

          if (mesclarCom != null) {

            migrouUmPartido = true;

            configDestino = Lazy(Configuracao.tabelaDePartidos).find(function(configDestino) {

              if (mesclarCom !== configDestino.sigla) {
                return false;
              }

              if (configDestino.extinto != null && configDestino.extinto < config.extinto) {
                return false;
              }

              if (config.incorporado != null) {
                if (configDestino.fundado > config.extinto) {
                  return false;
                }
              } else {
                if (configDestino.fundado < config.extinto) {
                  return false;
                }
              }

              return true;

            });

          }

        }

        return {
          sigla:   configDestino.sigla,
          numero:  configDestino.numero,
          fundado: partido.fundado == null ? config.fundado : partido.fundado,
          extinto: configDestino.extinto,
          indices: partido.indices
        };

      });

      // Força execução do Lazy para definir flag migrouUmPartido
      dadosCorrigidos = Lazy(dadosCorrigidos.toArray());

      if (migrouUmPartido === true) {

        // Agrupa partidos repetidos para mesclar
        var dadosAgrupados = dadosCorrigidos.groupBy(function(partido) {
          return partido.sigla + partido.numero;
        }).values();

        // Mescla partidos somando os índices
        var dadosMesclados = dadosAgrupados.map(function(partidos) {
          if (partidos.length == 1) {
            return partidos[0];
          }

          var todosOsIndices = Lazy(partidos).map(function(partido) {
            return partido.indices;
          }).flatten().chunk(2); // flatten 1 nível

          var indicesAgrupadosPorAno = todosOsIndices.groupBy(function(lista) {
            var ano = lista[0];
            return 'ano' + ano.toString();
          }).values();

          var somasDosIndicesPorAno = indicesAgrupadosPorAno.map(function(listas) {
            var ano = listas[0][0];
            var indicesNoMesmoAno = Lazy(listas).map(function(lista) { return lista[1]; });
            return [ ano, indicesNoMesmoAno.sum() ];
          });

          return {
            sigla:   partidos[0].sigla,
            numero:  partidos[0].numero,
            fundado: Lazy(partidos).pluck('fundado').min(),
            extinto: partidos[0].extinto,
            indices: somasDosIndicesPorAno
          };
        });

        // Força execução do Lazy para chamar função recursiva
        dadosMesclados = Lazy(dadosMesclados.toArray());

        // Reaplica migrações nos novos dados
        return this.corrigirDados(dadosMesclados);

      }

      return dadosCorrigidos;
    }

    Configuracao.prototype.reescreverSiglas = function(dados) {

      var _this = this;

      if (this.tabelaDeReescrita == null) {
        return dados;
      }

      // Realiza migrações
      var dadosCorrigidos = dados.map(function(partido) {

        var config = Lazy(_this.tabelaDeReescrita.mapear).find(function(config) {
          return partido.sigla  === config.de.sigla &&
                 partido.numero === config.de.numero;
        });

        if (config == null) {
          return { sigla: _this.tabelaDeReescrita.resto, indices: partido.indices };
        }

        return { sigla: config.para, indices: partido.indices };

      }).compact();

      // Agrupa partidos repetidos para mesclar
      var dadosAgrupados = dadosCorrigidos.groupBy(function(partido) {
        return partido.sigla;
      }).values();

      // Mescla partidos somando os índices
      var dadosMesclados = dadosAgrupados.map(function(partidos) {
        if (partidos.length == 1) {
          return partidos[0];
        }

        var todosOsIndices = Lazy(partidos).map(function(partido) {
          return partido.indices;
        }).flatten().chunk(2); // flatten 1 nível

        var indicesAgrupadosPorAno = todosOsIndices.groupBy(function(lista) {
          var ano = lista[0];
          return 'ano' + ano.toString();
        }).values();

        var somasDosIndicesPorAno = indicesAgrupadosPorAno.map(function(listas) {
          var ano = listas[0][0];
          var indicesNoMesmoAno = Lazy(listas).map(function(lista) { return lista[1]; });
          return [ ano, indicesNoMesmoAno.sum() ];
        });

        return { sigla: partidos[0].sigla, indices: somasDosIndicesPorAno };
      });

      return dadosMesclados;

    };

    return Configuracao;

  })();

  var Indice = (function() {

    function Indice() {}

    Indice.prototype.anos = function() { return Lazy([]); };
    Indice.prototype.siglas = function() { return Lazy([]); };
    Indice.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) { return false; };
    Indice.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) { return 0.0; };

    Indice.prototype.series = function(configuracao, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Filtra anos que não tem dados (ex.: anos sem todos os senadores)
      var anosComDados = _this.anos().filter(function(ano) {
        return _this.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);
      });

      // Calcula para cada sigla os índices por ano
      var indicesPorSigla = _this.siglas().map(function(sigla) {

        var config = Lazy(Configuracao.tabelaDePartidos).find(function(config) {
          return sigla === (config.sigla + config.numero.toString());
        });

        // Filtra anos que o partido existe
        var anosComDadosParaSigla = configuracao.filtrarAnos(anosComDados, config.fundado, config.extinto);

        // Mantém todas as possibilidades, realiza o filtro de novo depois de corrigir siglas
        anosComDadosParaSigla = Lazy([ anosComDados, anosComDadosParaSigla ]).flatten().map(toInt).uniq();

        var indicePorAno = anosComDadosParaSigla.map(function(ano) {
          return [ parseInt(ano, 10), _this.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) ];
        });

        return { sigla: sigla, indices: indicePorAno };

      });

      // Extrai siglas e números dos partidos
      indicesPorSigla = indicesPorSigla.map(function(partido) {
        var matches = partido.sigla.match(/(.*?)([0-9]{2})/);
        return {
          sigla: matches[1],
          numero: parseInt(matches[2], 10),
          indices: partido.indices
        };
      });

      // Força execução do Lazy pra poder chamar função recursiva (corrigirDados) sem executar várias vezes
      indicesPorSigla = Lazy(indicesPorSigla.toArray());

      // Aplica configuração de partidos (parte 1)
      indicesPorSigla = configuracao.corrigirDados(indicesPorSigla);

      // Filtra anos que o partido existe
      indicesPorSigla = indicesPorSigla.map(function(partido) {

        var anosComDadosParaSigla = configuracao.filtrarAnos(anosComDados, partido.fundado, partido.extinto);

        var indicesPorAno = anosComDadosParaSigla.map(function(ano) {
          var indice = partido.indices.find(function(indice) { return ano == indice[0]; })[1];
          return [ ano, indice ];
        });

        return { sigla: partido.sigla, numero: partido.numero, indices: indicesPorAno };

      });

      // Aplica configuração de partidos (parte 2)
      indicesPorSigla = configuracao.reescreverSiglas(indicesPorSigla);

      // Filtra partidos que não tem dados para nenhum ano
      indicesPorSigla = indicesPorSigla.filter(function(partido) {
        return partido.indices.some();
      });

      // Converte anos dos índices em datas
      indicesPorSigla = indicesPorSigla.map(function(partido) {

        var indices = partido.indices.map(function(tupla) {
          var ano = tupla[0], indice = tupla[1];
          return [ Date.UTC(ano + 1, 0, 1), indice ];
        });

        return { sigla: partido.sigla, indices: indices };

      });

      // Converte para formato esperado pelo Highcharts
      indicesPorSigla = indicesPorSigla.map(function(linha) {

        // Índices ordenados por ano (Highcharts faz a linha dar voltas se não tiver ordenado)
        var indicesOrdenados = linha.indices.sortBy(function(linha) { return linha[0]; }).toArray();

        var result = {
          name: linha.sigla,
          data: indicesOrdenados
        };

        if (configuracao.tabelaDeReescrita != null && linha.sigla === configuracao.tabelaDeReescrita.resto) {

          result.color = '#333';

          if (configuracao.ehGraficoArea === false) {
            result.dashStyle = 'dash';
          }

        }

        return result;

      });

      // Ordena pela "importância do partido", isto é, a soma de todos os índices
      indicesPorSigla = indicesPorSigla.sortBy(function(linha) {

        var somaDosIndices = Lazy(linha.data).sum(function(tupla) { return tupla[1]; });

        // Faz ajusta na ordenação para manter o resto em último
        if (configuracao.tabelaDeReescrita != null) {
          somaDosIndices += (configuracao.tabelaDeReescrita.resto == linha.name) ? 0 : 9999;
        }

        return somaDosIndices;

      }, true);

      return indicesPorSigla.toArray();
    };

    return Indice;

  })();

  var MandatoQuatroAnos = (function() {

    _extends(MandatoQuatroAnos, Indice);

    function MandatoQuatroAnos() {}

    MandatoQuatroAnos.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) { return 0; };
    MandatoQuatroAnos.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) { return 0; };

    MandatoQuatroAnos.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this, _ano = parseInt(ano, 10);

      // Eleições que ainda teria mandato
      var mandato = Lazy.range(_ano, _ano - 4, -1);

      return mandato.some(function(ano) {
        return Lazy(ufs).some(function(uf) {
          return _this.valorTotal(ano.toString(), uf, metodoPesoUe, pesoExecutivo) > 0;
        });
      });

    };

    MandatoQuatroAnos.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var _this = this, _ano = parseInt(ano, 10);

      // Eleições que ainda teria mandato
      var mandato = Lazy.range(_ano, _ano - 4, -1);

      var eleitos = mandato.sum(function(ano) {
        return Lazy(ufs).sum(function(uf) {
          return _this.valorPorSigla(ano.toString(), uf, sigla, metodoPesoUe, pesoExecutivo);
        });
      });

      var total = mandato.sum(function(ano) {
        return Lazy(ufs).sum(function(uf) {
          return _this.valorTotal(ano.toString(), uf, metodoPesoUe, pesoExecutivo);
        });
      });

      return eleitos / total * 100;

    };

    return MandatoQuatroAnos;

  })();

  var MandatoOitoAnos = (function() {

    _extends(MandatoOitoAnos, Indice);

    function MandatoOitoAnos() {}

    MandatoOitoAnos.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) { return 0; };
    MandatoOitoAnos.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) { return 0; };

    MandatoOitoAnos.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this, _ano = parseInt(ano, 10);

      // Eleições que ainda teria mandato
      var metade1 = Lazy.range(_ano, _ano - 4, -1);
      var metade2 = Lazy.range(_ano - 4, _ano - 8, -1);

      // Precisa de dados de duas eleições
      return Lazy([ metade1, metade2 ]).every(function(metadeDoMandato) {
        return metadeDoMandato.some(function(ano) {
            return Lazy(ufs).some(function(uf) {
              return _this.valorTotal(ano.toString(), uf, metodoPesoUe, pesoExecutivo) > 0;
            });
        });
      });

    };

    MandatoOitoAnos.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var _this = this, _ano = parseInt(ano, 10);

      // Eleições que ainda teria mandato
      var mandato = Lazy.range(_ano, _ano - 8, -1);

      var eleitos = mandato.sum(function(ano) {
        return Lazy(ufs).sum(function(uf) {
          return _this.valorPorSigla(ano.toString(), uf, sigla, metodoPesoUe, pesoExecutivo);
        });
      });

      var total = mandato.sum(function(ano) {
        return Lazy(ufs).sum(function(uf) {
          return _this.valorTotal(ano.toString(), uf, metodoPesoUe, pesoExecutivo);
        });
      });

      return eleitos / total * 100;

    };

    return MandatoOitoAnos;

  })();

  var CamaraDosDeputados = (function() {

    _extends(CamaraDosDeputados, MandatoQuatroAnos);

    function CamaraDosDeputados(eleicoes) {
      this.eleicoes = eleicoes;
    }

    CamaraDosDeputados.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    CamaraDosDeputados.prototype.siglas = function() {
      return this.eleicoes.siglasDeputadosFederais();
    };

    CamaraDosDeputados.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.totalDeputadosFederais(ano);
    };

    CamaraDosDeputados.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.deputadosFederais(ano, sigla);
    };

    return CamaraDosDeputados;

  })();

  var SenadoFederal = (function() {

    _extends(SenadoFederal, MandatoOitoAnos);

    function SenadoFederal(eleicoes) {
      this.eleicoes = eleicoes;
    }

    SenadoFederal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    SenadoFederal.prototype.siglas = function() {
      return this.eleicoes.siglasSenadores();
    };

    SenadoFederal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.totalSenadores(ano);
    };

    SenadoFederal.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.senadores(ano, sigla);
    };

    return SenadoFederal;

  })();

  var LegislativoFederal = (function() {

    _extends(LegislativoFederal, Indice);

    function LegislativoFederal(eleicoes) {
      this.eleicoes = eleicoes;

      this.deputadosFederais = new CamaraDosDeputados(eleicoes);
      this.senadores         = new SenadoFederal(eleicoes);
    }

    LegislativoFederal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    LegislativoFederal.prototype.siglas = function() {
      return Lazy([ this.deputadosFederais.siglas(), this.senadores.siglas() ]).flatten().uniq();
    };

    LegislativoFederal.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.deputadosFederais.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.senadores.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);
    };

    LegislativoFederal.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      return this.deputadosFederais.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) * 0.5 +
             this.senadores.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo)         * 0.5;
    };

    return LegislativoFederal;

  })();

  var ExecutivoFederal = (function() {

    _extends(ExecutivoFederal, MandatoQuatroAnos);

    function ExecutivoFederal(eleicoes) {
      this.eleicoes = eleicoes;
    }

    ExecutivoFederal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    ExecutivoFederal.prototype.siglas = function() {
      return this.eleicoes.siglasPresidentes();
    };

    ExecutivoFederal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.totalPresidentes(ano);
    };

    ExecutivoFederal.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      return this.eleicoes.presidentes(ano, sigla);
    };

    return ExecutivoFederal;

  })();

  var IndiceFederal = (function() {

    _extends(IndiceFederal, Indice);

    function IndiceFederal(eleicoes) {
      this.eleicoes = eleicoes;

      this.congressoNacional = new LegislativoFederal(eleicoes);
      this.presidentes       = new ExecutivoFederal(eleicoes);
    }

    IndiceFederal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    IndiceFederal.prototype.siglas = function() {
      return Lazy([ this.congressoNacional.siglas(), this.presidentes.siglas() ]).flatten().uniq();
    };

    IndiceFederal.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.congressoNacional.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.presidentes.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    IndiceFederal.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var pesoLegislativo = 1 - pesoExecutivo;

      return this.congressoNacional.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) * pesoLegislativo +
             this.presidentes.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo)       * pesoExecutivo;

    };

    return IndiceFederal;

  })();

  var LegislativoEstadual = (function() {

    _extends(LegislativoEstadual, MandatoQuatroAnos);

    function LegislativoEstadual(eleicoes) {
      this.eleicoes = eleicoes;
    }

    LegislativoEstadual.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    LegislativoEstadual.prototype.siglas = function() {
      return this.eleicoes.siglasDeputadosEstaduais();
    };

    LegislativoEstadual.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.totalDeputadosEstaduais(ano, uf);
      } else if (metodoPesoUe === 'populacao') {
        return this.eleicoes.totalPopulacao(ano, uf);
      }
    };

    LegislativoEstadual.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.deputadosEstaduais(ano, uf, sigla);
      } else if (metodoPesoUe === 'populacao') {
        return this.eleicoes.deputadosEstaduaisProporcionalAPopulacao(ano, uf, sigla);
      }
    };

    return LegislativoEstadual;

  })();

  var ExecutivoEstadual = (function() {

    _extends(ExecutivoEstadual, MandatoQuatroAnos);

    function ExecutivoEstadual(eleicoes) {
      this.eleicoes = eleicoes;
    }

    ExecutivoEstadual.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    ExecutivoEstadual.prototype.siglas = function() {
      return this.eleicoes.siglasGovernadores();
    };

    ExecutivoEstadual.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal') {
        return this.eleicoes.totalGovernadores(ano, uf);
      } else if (metodoPesoUe === 'legislativo') {
        return this.eleicoes.totalDeputadosEstaduais(ano, uf);
      } else if (metodoPesoUe === 'populacao') {
        return this.eleicoes.totalPopulacao(ano, uf);
      }
    };

    ExecutivoEstadual.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal') {
        return this.eleicoes.governadores(ano, uf, sigla);
      } else if (metodoPesoUe === 'legislativo') {
        return this.eleicoes.governadoresProporcionalAosDeputados(ano, uf, sigla);
      } else if (metodoPesoUe === 'populacao') {
        return this.eleicoes.governadoresProporcionalAPopulacao(ano, uf, sigla);
      }
    };

    return ExecutivoEstadual;

  })();

  var IndiceEstadual = (function() {

    _extends(IndiceEstadual, Indice);

    function IndiceEstadual(eleicoes) {
      this.eleicoes = eleicoes;

      this.deputadosEstaduais = new LegislativoEstadual(eleicoes);
      this.governadores       = new ExecutivoEstadual(eleicoes);
    }

    IndiceEstadual.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    IndiceEstadual.prototype.siglas = function() {
      return Lazy([ this.deputadosEstaduais.siglas(), this.governadores.siglas() ]).flatten().uniq();
    };

    IndiceEstadual.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.deputadosEstaduais.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.governadores.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    IndiceEstadual.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var pesoLegislativo = 1 - pesoExecutivo;

      return this.deputadosEstaduais.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) * pesoLegislativo +
             this.governadores.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo)       * pesoExecutivo;

    };

    return IndiceEstadual;

  })();

  var LegislativoMunicipal = (function() {

    _extends(LegislativoMunicipal, MandatoQuatroAnos);

    function LegislativoMunicipal(eleicoes, distritais) {
      this.eleicoes   = eleicoes;
      this.distritais = distritais;
    }

    LegislativoMunicipal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    LegislativoMunicipal.prototype.siglas = function() {
      return Lazy([ this.eleicoes.siglasVereadores(), this.distritais.siglasDeputadosEstaduais() ]).flatten().uniq();
    };

    LegislativoMunicipal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.totalVereadores(ano, uf);
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.totalPopulacao(ano, uf);
        } else {
          return this.eleicoes.totalPopulacao(ano, uf);
        }
      }
    };

    LegislativoMunicipal.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.vereadores(ano, uf, sigla);
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.deputadosEstaduaisProporcionalAPopulacao(ano, uf, sigla);
        } else {
          return this.eleicoes.vereadoresProporcionalAPopulacao(ano, uf, sigla);
        }
      }
    };

    return LegislativoMunicipal;

  })();

  var ExecutivoMunicipal = (function() {

    _extends(ExecutivoMunicipal, MandatoQuatroAnos);

    function ExecutivoMunicipal(eleicoes, distritais) {
      this.eleicoes   = eleicoes;
      this.distritais = distritais;
    }

    ExecutivoMunicipal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    ExecutivoMunicipal.prototype.siglas = function() {
      return Lazy([ this.eleicoes.siglasPrefeitos(), this.distritais.siglasGovernadores() ]).flatten().uniq();
    };

    ExecutivoMunicipal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.totalPrefeitos(ano, uf);
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.totalPopulacao(ano, uf);
        } else {
          return this.eleicoes.totalPopulacao(ano, uf);
        }
      }
    };

    ExecutivoMunicipal.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        return this.eleicoes.prefeitos(ano, uf, sigla);
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.governadoresProporcionalAPopulacao(ano, uf, sigla);
        } else {
          return this.eleicoes.prefeitosProporcionalAPopulacao(ano, uf, sigla);
        }
      }
    };

    return ExecutivoMunicipal;

  })();

  var IndiceMunicipal = (function() {

    _extends(IndiceMunicipal, Indice);

    function IndiceMunicipal(eleicoes, distritais) {
      this.eleicoes = eleicoes;

      this.vereadores = new LegislativoMunicipal(eleicoes, distritais);
      this.prefeitos  = new ExecutivoMunicipal(eleicoes, distritais);
    }

    IndiceMunicipal.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    IndiceMunicipal.prototype.siglas = function() {
      return Lazy([ this.vereadores.siglas(), this.prefeitos.siglas() ]).flatten().uniq();
    };

    IndiceMunicipal.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.vereadores.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.prefeitos.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    IndiceMunicipal.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var pesoLegislativo = 1 - pesoExecutivo;

      return this.vereadores.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) * pesoLegislativo +
             this.prefeitos.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo)  * pesoExecutivo;

    };

    return IndiceMunicipal;

  })();

  var IndiceNacional = (function() {

    _extends(IndiceNacional, Indice);

    function IndiceNacional(federais, estaduais, municipais) {
      this.federais   = federais;
      this.estaduais  = estaduais;
      this.municipais = municipais;

      this.indiceFederal   = new IndiceFederal(federais);
      this.indiceEstadual  = new IndiceEstadual(estaduais);
      this.indiceMunicipal = new IndiceMunicipal(municipais, estaduais);
    }

    IndiceNacional.prototype.anos = function() {
      return Lazy([ this.federais.anos(), this.estaduais.anos(), this.municipais.anos() ]).flatten().uniq();
    };

    IndiceNacional.prototype.siglas = function() {
      return Lazy([ this.indiceFederal.siglas(), this.indiceEstadual.siglas(), this.indiceMunicipal.siglas() ]).flatten().uniq();
    };

    IndiceNacional.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.indiceFederal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.indiceEstadual.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.indiceMunicipal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    IndiceNacional.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      return this.indiceFederal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.indiceEstadual.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.indiceMunicipal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3;

    };

    return IndiceNacional;

  })();

  var Eleicoes = (function() {

    function Eleicoes(json) {
      this.json = json;
      this.banco = {};
    }

    Eleicoes.prototype.obter = function(chave, fn) {
      if (!(chave in this.banco)) {
        this.banco[chave] = fn.call(this);
      }
      return this.banco[chave];
    };

    Eleicoes.prototype.anos = function() {

      var _this = this;

      return _this.obter('anos', function() {
        return Lazy(_this.json).keys();
      });
    };

    Eleicoes.prototype.siglas = function(cargo) {

      var _this = this;

      return _this.obter(cargo, function () {
        return _this.anos().map(function(ano) {
          return Lazy(_this.json[ano]._BR[cargo + "_por_sigla"]).keys();
        }).flatten().uniq();
      });
    };

    Eleicoes.prototype.dadosPorSigla = function(nome, tipo, ano, uf) {

      if (!(ano in this.json)) {
        return {};
      }

      var _this = this;
      var chave = nome + '_por_sigla' + (tipo == null ? '' : ('_' + tipo));
      return this.obter(chave + ano + (uf || ''), function() {
        if (uf != null) {
          return _this.json[ano][uf][chave];
        } else {
          return _this.json[ano]._BR[chave];
        }
      });
    };

    Eleicoes.prototype.total = function(nome, ano, uf) {

      if (!(ano in this.json)) {
        return 0;
      }

      var chave = "total_" + nome;
      if (uf != null) {
        return this.json[ano][uf][chave];
      } else {
        return this.json[ano]._BR[chave];
      }

    };

    Eleicoes.prototype.totalPopulacao = function(ano, uf) {
      return this.total('populacao', ano, uf);
    };

    return Eleicoes;

  })();

  var EleicoesFederais = (function() {

    _extends(EleicoesFederais, Eleicoes);

    function EleicoesFederais() {
      Eleicoes.prototype.constructor.apply(this, arguments);
    }

    EleicoesFederais.prototype.siglasDeputadosFederais = function() {
      return this.siglas('deputados_federais');
    };

    EleicoesFederais.prototype.siglasSenadores = function() {
      return this.siglas('senadores');
    };

    EleicoesFederais.prototype.siglasPresidentes = function() {
      return this.siglas('presidentes');
    };

    EleicoesFederais.prototype.totalDeputadosFederais = function(ano) {
      return this.total('deputados_federais', ano);
    };

    EleicoesFederais.prototype.totalSenadores = function(ano) {
      return this.total('senadores', ano);
    };

    EleicoesFederais.prototype.totalPresidentes = function(ano) {
      return this.total('presidentes', ano);
    };

    EleicoesFederais.prototype.deputadosFederais = function(ano, sigla) {
      return this.dadosPorSigla('deputados_federais', null, ano)[sigla] || 0;
    };

    EleicoesFederais.prototype.senadores = function(ano, sigla) {
      return this.dadosPorSigla('senadores', null, ano)[sigla] || 0;
    };

    EleicoesFederais.prototype.presidentes = function(ano, sigla) {
      return this.dadosPorSigla('presidentes', null, ano)[sigla] || 0;
    };

    return EleicoesFederais;

  })();

  var EleicoesEstaduais = (function() {

    _extends(EleicoesEstaduais, Eleicoes);

    function EleicoesEstaduais() {
      Eleicoes.prototype.constructor.apply(this, arguments);
    }

    EleicoesEstaduais.prototype.siglasDeputadosEstaduais = function() {
      return this.siglas('deputados_estaduais');
    };

    EleicoesEstaduais.prototype.siglasGovernadores = function() {
      return this.siglas('governadores');
    };

    EleicoesEstaduais.prototype.totalDeputadosEstaduais = function(ano, uf) {
      return this.total('deputados_estaduais', ano, uf);
    };

    EleicoesEstaduais.prototype.totalGovernadores = function(ano, uf) {
      return this.total('governadores', ano, uf);
    };

    EleicoesEstaduais.prototype.deputadosEstaduais = function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_estaduais', null, ano, uf)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.governadores = function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', null, ano, uf)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.deputadosEstaduaisProporcionalAPopulacao = function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_estaduais', 'peso_populacao', ano, uf)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.governadoresProporcionalAosDeputados = function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', 'peso_legislativo', ano, uf)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.governadoresProporcionalAPopulacao = function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', 'peso_populacao', ano, uf)[sigla] || 0;
    };

    return EleicoesEstaduais;

  })();

  var EleicoesMunicipais = (function() {

    _extends(EleicoesMunicipais, Eleicoes);

    function EleicoesMunicipais() {
      Eleicoes.prototype.constructor.apply(this, arguments);
    }

    EleicoesMunicipais.prototype.siglasVereadores = function() {
      return this.siglas('vereadores');
    };

    EleicoesMunicipais.prototype.siglasPrefeitos = function() {
      return this.siglas('prefeitos');
    };

    EleicoesMunicipais.prototype.totalVereadores = function(ano, uf) {
      return this.total('vereadores', ano, uf);
    };

    EleicoesMunicipais.prototype.totalPrefeitos = function(ano, uf) {
      return this.total('prefeitos', ano, uf);
    };

    EleicoesMunicipais.prototype.vereadores = function(ano, uf, sigla) {
      return this.dadosPorSigla('vereadores', null, ano, uf)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.prefeitos = function(ano, uf, sigla) {
      return this.dadosPorSigla('prefeitos', null, ano, uf)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.vereadoresProporcionalAPopulacao = function(ano, uf, sigla) {
      return this.dadosPorSigla('vereadores', 'peso_populacao', ano, uf)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.prefeitosProporcionalAosVereadores = function(ano, uf, sigla) {
      return this.dadosPorSigla('prefeitos', 'peso_legislativo', ano, uf)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.prefeitosProporcionalAPopulacao = function(ano, uf, sigla) {
      return this.dadosPorSigla('prefeitos', 'peso_populacao', ano, uf)[sigla] || 0;
    };

    return EleicoesMunicipais;

  })();

  window.GeradorDeIndices = (function() {

    function GeradorDeIndices(eleitos, configuracao) {
      this.eleitos      = eleitos;
      this.configuracao = configuracao;

      this.federais   = new EleicoesFederais(this.eleitos.federais);
      this.estaduais  = new EleicoesEstaduais(this.eleitos.estaduais);
      this.municipais = new EleicoesMunicipais(this.eleitos.municipais);
    }

    GeradorDeIndices.prototype.camaraDosDeputados = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new CamaraDosDeputados(this.federais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.senadoFederal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new SenadoFederal(this.federais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.legislativoFederal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new LegislativoFederal(this.federais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.executivoFederal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new ExecutivoFederal(this.federais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.indiceFederal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new IndiceFederal(this.federais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.legislativoEstadual = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new LegislativoEstadual(this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.executivoEstadual = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new ExecutivoEstadual(this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.indiceEstadual = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new IndiceEstadual(this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.legislativoMunicipal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new LegislativoMunicipal(this.municipais, this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.executivoMunicipal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new ExecutivoMunicipal(this.municipais, this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.indiceMunicipal = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new IndiceMunicipal(this.municipais, this.estaduais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    GeradorDeIndices.prototype.indiceNacional = function(ufs, metodoPesoUe, pesoExecutivo) {
      var indice = new IndiceNacional(this.federais, this.estaduais, this.municipais);
      return indice.series(this.configuracao, ufs, metodoPesoUe, pesoExecutivo);
    };

    return GeradorDeIndices;

  })();

})();
