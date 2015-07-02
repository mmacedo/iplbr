/* globals _ */

(function(_) {
  'use strict';

  function herdar(filha, mae) {
    filha.prototype = _.create(mae.prototype, { constructor: filha });
  }

  function Eleicoes(json) {
    this.json = json;
  }

  _.extend(Eleicoes.prototype, {

    anos: function(uf) {

      var _this = this;

      var anos = _.keys(this.json);

      var anosComUf = (uf == null || uf === '_BR') ? anos : _.filter(anos, function(ano) {
        return uf in _this.json[ano];
      });

      return _.map(anosComUf, function(ano) {
        return parseInt(ano, 10);
      });

    },

    siglas: function(cargo, ano, uf) {

      var chaveAno = ano.toString();
      if (!(chaveAno in this.json)) {
        return [];
      }

      var chaveUf = uf != null ? uf : '_BR';
      if (!(chaveUf in this.json[chaveAno])) {
        return [];
      }

      var chaveCargo = cargo + '_por_sigla';
      if (!(chaveCargo in this.json[chaveAno][chaveUf])) {
        return [];
      }

      return _.keys(this.json[chaveAno][chaveUf][chaveCargo]);

    },

    dadosPorSigla: function(cargo, tipo, ano, uf) {

      if (!(ano.toString() in this.json)) {
        return {};
      }

      var chave = cargo + '_por_sigla' + (tipo != null ? ('_' + tipo) : '');
      if (uf != null) {
        if (uf in this.json[ano.toString()]) {
          return this.json[ano.toString()][uf][chave];
        } else {
          return 0.0;
        }
      } else {
        return this.json[ano.toString()]._BR[chave];
      }

    },

    total: function(cargo, ano, uf) {

      if (!(ano.toString() in this.json)) {
        return 0;
      }

      var chave = 'total_' + cargo;
      if (uf != null) {
        if (uf in this.json[ano.toString()]) {
          return this.json[ano.toString()][uf][chave];
        } else {
          return 0.0;
        }
      } else {
        return this.json[ano.toString()]._BR[chave];
      }

    },

    totalPopulacao: function(ano, uf) {
      return this.total('populacao', ano, uf);
    },

  });

  function EleicoesPresidenciais() {
    Eleicoes.apply(this, arguments);
  }

  herdar(EleicoesPresidenciais, Eleicoes);

  _.extend(EleicoesPresidenciais.prototype, {

    anos: function() {
      return _.map(_.keys(this.json), function(ano) { return parseInt(ano, 10); });
    },

    siglasPresidentes: function(ano) {
      return ano.toString() in this.json ? [ this.json[ano.toString()] ] : [];
    },

    totalPresidentes: function(ano) {
      return ano.toString() in this.json ? 1 : 0;
    },

    presidentes: function(ano, sigla) {
      return this.json[ano.toString()] === sigla ? 1 : 0;
    },

  });

  function EleicoesFederais() {
    Eleicoes.apply(this, arguments);
  }

  herdar(EleicoesFederais, Eleicoes);

  _.extend(EleicoesFederais.prototype, {

    anos: function() {
      return _.map(_.keys(this.json), function(ano) { return parseInt(ano, 10); });
    },

    siglasDeputadosFederais: function(ano) {
      return this.siglas('deputados_federais', ano);
    },

    siglasSenadores: function(ano) {
      return this.siglas('senadores', ano);
    },

    totalDeputadosFederais: function(ano) {
      return this.total('deputados_federais', ano);
    },

    totalSenadores: function(ano) {
      return this.total('senadores', ano);
    },

    deputadosFederais: function(ano, sigla) {
      return this.dadosPorSigla('deputados_federais', null, ano)[sigla] || 0;
    },

    senadores: function(ano, sigla) {
      return this.dadosPorSigla('senadores', null, ano)[sigla] || 0;
    },

    presidentes: function(ano, sigla) {
      return this.dadosPorSigla('presidentes', null, ano)[sigla] || 0;
    },

  });

  function EleicoesEstaduais() {
    Eleicoes.apply(this, arguments);
  }

  herdar(EleicoesEstaduais, Eleicoes);

  _.extend(EleicoesEstaduais.prototype, {

    siglasDeputadosEstaduais: function(ano, uf) {
      return this.siglas('deputados_estaduais', ano, uf);
    },

    siglasGovernadores: function(ano, uf) {
      return this.siglas('governadores', ano, uf);
    },

    totalDeputadosEstaduais: function(ano, uf) {
      return this.total('deputados_estaduais', ano, uf);
    },

    totalGovernadores: function(ano, uf) {
      return this.total('governadores', ano, uf);
    },

    deputadosEstaduais: function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_estaduais', null, ano, uf)[sigla] || 0;
    },

    governadores: function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', null, ano, uf)[sigla] || 0;
    },

    deputadosEstaduaisProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_estaduais', 'peso_populacao', ano, uf)[sigla] || 0;
    },

    governadoresProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', 'peso_populacao', ano, uf)[sigla] || 0;
    },

  });

  function EleicoesDistritais() {
    Eleicoes.apply(this, arguments);
  }

  herdar(EleicoesDistritais, Eleicoes);

  _.extend(EleicoesDistritais.prototype, {

    siglasDeputadosDistritais: function(ano, uf) {
      return this.siglas('deputados_distritais', ano, uf);
    },

    siglasGovernadores: function(ano, uf) {
      return this.siglas('governadores', ano, uf);
    },

    totalDeputadosDistritais: function(ano, uf) {
      return this.total('deputados_distritais', ano, uf);
    },

    totalGovernadores: function(ano, uf) {
      return this.total('governadores', ano, uf);
    },

    deputadosDistritais: function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_distritais', null, ano, uf)[sigla] || 0;
    },

    governadores: function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', null, ano, uf)[sigla] || 0;
    },

    deputadosDistritaisProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('deputados_distritais', 'peso_populacao', ano, uf)[sigla] || 0;
    },

    governadoresProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('governadores', 'peso_populacao', ano, uf)[sigla] || 0;
    },

  });

  function EleicoesMunicipais() {
    Eleicoes.apply(this, arguments);
  }

  herdar(EleicoesMunicipais, Eleicoes);

  _.extend(EleicoesMunicipais.prototype, {

    siglasVereadores: function(ano, uf) {
      return this.siglas('vereadores', ano, uf);
    },

    siglasPrefeitos: function(ano, uf) {
      return this.siglas('prefeitos', ano, uf);
    },

    totalVereadores: function(ano, uf) {
      return this.total('vereadores', ano, uf);
    },

    totalPrefeitos: function(ano, uf) {
      return this.total('prefeitos', ano, uf);
    },

    vereadores: function(ano, uf, sigla) {
      return this.dadosPorSigla('vereadores', null, ano, uf)[sigla] || 0;
    },

    prefeitos: function(ano, uf, sigla) {
      return this.dadosPorSigla('prefeitos', null, ano, uf)[sigla] || 0;
    },

    vereadoresProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('vereadores', 'peso_populacao', ano, uf)[sigla] || 0;
    },

    prefeitosProporcionalAPopulacao: function(ano, uf, sigla) {
      return this.dadosPorSigla('prefeitos', 'peso_populacao', ano, uf)[sigla] || 0;
    },

  });

  function Indice() {}

  _.extend(Indice.prototype, {
    anos: function(uf) { return []; },
    siglas: function(anos, ufs) { return []; },
    temDados: function(ano, ufs) { return false; },
    calculaIndice: function(ano, ufs, sigla) { return 0.0; },
  });

  function MandatoQuatroAnos() {}

  herdar(MandatoQuatroAnos, Indice);

  _.extend(MandatoQuatroAnos.prototype, {

    valorTotal: function(ano, uf) { return 0; },
    valorPorSigla: function(ano, uf, sigla) { return 0; },

    siglas: function(anos, ufs) {

      var _this = this;

      // Eleições que ainda teria mandato em algum dos anos
      var anosComMandato = _.uniq(_.flatten(_.map(anos, function(ano) {
        return _.range(ano, ano - 4, -1);
      })));

      // Siglas para todos os anos e ufs especificados
      var siglasPorAno = _.map(anosComMandato, function(ano) {
        var siglasPorUf = _.map(ufs, function(uf) {
          return _this.siglasPorCargo(ano, uf);
        });
        return _.uniq(_.flatten(siglasPorUf));
      });

      return _.uniq(_.flatten(siglasPorAno));

    },

    temDados: function(ano, ufs) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      return _.every(ufs, function(uf) {
        return _.some(anos, function(ano) {
          return _this.valorTotal(ano, uf) > 0;
        });
      });

    },

    calculaIndice: function(ano, ufs, sigla) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      var eleitos = 0, total = 0;
      _.each(anos, function(ano) {
        _.each(ufs, function(uf) {
          total   += _this.valorTotal(ano, uf);
          eleitos += _this.valorPorSigla(ano, uf, sigla);
        });
      });

      return eleitos / total * 100;

    },

  });

  function MandatoOitoAnos() {}

  herdar(MandatoOitoAnos, Indice);

  _.extend(MandatoOitoAnos.prototype, {

    valorTotal: function(ano, uf) { return 0; },
    valorPorSigla: function(ano, uf, sigla) { return 0; },

    siglas: function(anos, ufs) {

      var _this = this;

      // Eleições que ainda teria mandato em algum dos anos
      var anosComMandato = _.uniq(_.flatten(_.map(anos, function(ano) {
        return _.range(ano, ano - 8, -1);
      })));

      // Siglas para todos os anos e ufs especificados
      var siglasPorAno = _.map(anosComMandato, function(ano) {
        var siglasPorUf = _.map(ufs, function(uf) {
          return _this.siglasPorCargo(ano, uf);
        });
        return _.uniq(_.flatten(siglasPorUf));
      });

      return _.uniq(_.flatten(siglasPorAno));

    },

    temDados: function(ano, ufs) {

      var _this = this;

      // Eleições que ainda teria mandato
      var metade1 = _.range(ano,     ano - 4, -1);
      var metade2 = _.range(ano - 4, ano - 8, -1);

      // Precisa de dados de duas eleições
      return _.every([ metade1, metade2 ], function(anos) {
        return _.every(ufs, function(uf) {
          return _.some(anos, function(ano) {
            return _this.valorTotal(ano, uf) > 0;
          });
        });
      });

    },

    calculaIndice: function(ano, ufs, sigla) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 8, -1);

      var eleitos = 0, total = 0;
      _.each(anos, function(ano) {
        _.each(ufs, function(uf) {
          total   += _this.valorTotal(ano, uf);
          eleitos += _this.valorPorSigla(ano, uf, sigla);
        });
      });

      return eleitos / total * 100;

    },

  });

  function DeputadosFederais(eleicoesFederais) {
    this.eleicoesFederais = eleicoesFederais;
  }

  herdar(DeputadosFederais, MandatoQuatroAnos);

  _.extend(DeputadosFederais.prototype, {

    anos: function() {
      return this.eleicoesFederais.anos();
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesFederais.siglasDeputadosFederais(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesFederais.totalDeputadosFederais(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesFederais.deputadosFederais(ano, sigla);
    },

  });

  function Senadores(eleicoesFederais) {
    this.eleicoesFederais = eleicoesFederais;
  }

  herdar(Senadores, MandatoOitoAnos);

  _.extend(Senadores.prototype, {

    anos: function() {
      return this.eleicoesFederais.anos();
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesFederais.siglasSenadores(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesFederais.totalSenadores(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesFederais.senadores(ano, sigla);
    },

  });

  function Presidentes(eleicoesPresidenciais) {
    this.eleicoesPresidenciais = eleicoesPresidenciais;
  }

  herdar(Presidentes, MandatoQuatroAnos);

  _.extend(Presidentes.prototype, {

    anos: function(uf) {
      return this.eleicoesPresidenciais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesPresidenciais.siglasPresidentes(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesPresidenciais.totalPresidentes(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesPresidenciais.presidentes(ano, sigla);
    },

  });

  function DeputadosEstaduais(eleicoesEstaduais) {
    this.eleicoesEstaduais = eleicoesEstaduais;
  }

  herdar(DeputadosEstaduais, MandatoQuatroAnos);

  _.extend(DeputadosEstaduais.prototype, {

    anos: function(uf) {
      return this.eleicoesEstaduais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesEstaduais.siglasDeputadosEstaduais(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesEstaduais.totalDeputadosEstaduais(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesEstaduais.deputadosEstaduais(ano, sigla);
    },

  });

  function GovernadoresEstaduais(eleicoesEstaduais) {
    this.eleicoesEstaduais = eleicoesEstaduais;
  }

  herdar(DeputadosEstaduais, MandatoQuatroAnos);

  _.extend(GovernadoresEstaduais.prototype, {

    anos: function(uf) {
      return this.eleicoesEstaduais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesEstaduais.siglasGovernadores(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesEstaduais.totalGovernadores(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesEstaduais.governadores(ano, sigla);
    },

  });

  function DeputadosDistritais(eleicoesDistritais) {
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(DeputadosDistritais, MandatoQuatroAnos);

  _.extend(DeputadosDistritais.prototype, {

    anos: function(uf) {
      return this.eleicoesDistritais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesDistritais.siglasDeputadosDistritais(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesDistritais.totalDeputadosDistritais(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesDistritais.deputadosDistritais(ano, sigla);
    },

  });

  function GovernadoresDistritais(eleicoesDistritais) {
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(GovernadoresDistritais, MandatoQuatroAnos);

  _.extend(GovernadoresDistritais.prototype, {

    anos: function(uf) {
      return this.eleicoesDistritais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesDistritais.siglasGovernadores(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesDistritais.totalGovernadores(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesDistritais.governadores(ano, sigla);
    },

  });

  function Vereadores(eleicoesMunicipais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
  }

  herdar(Vereadores, MandatoQuatroAnos);

  _.extend(Vereadores.prototype, {

    anos: function(uf) {
      return this.eleicoesMunicipais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesMunicipais.siglasVereadores(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesMunicipais.totalVereadores(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesMunicipais.vereadores(ano, sigla);
    },

  });

  function Prefeitos(eleicoesMunicipais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
  }

  herdar(Prefeitos, MandatoQuatroAnos);

  _.extend(Prefeitos.prototype, {

    anos: function(uf) {
      return this.eleicoesMunicipais.anos(uf);
    },

    siglasPorCargo: function(ano, uf) {
      return this.eleicoesMunicipais.siglasPrefeitos(ano);
    },

    valorTotal: function(ano, uf) {
      return this.eleicoesMunicipais.totalPrefeitos(ano);
    },

    valorPorSigla: function(ano, uf, sigla) {
      return this.eleicoesMunicipais.prefeitos(ano, sigla);
    },

  });

  function LegislativoFederal(deputadosFederais, senadores) {
    this.deputadosFederais = deputadosFederais;
    this.senadores         = senadores;
  }

  herdar(LegislativoFederal, Indice);

  _.extend(LegislativoFederal.prototype, {

    anos: function() {
      var anos = [ this.deputadosFederais.anos(), this.senadores.anos() ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.deputadosFederais.siglas(anos, ufs), this.senadores.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.deputadosFederais.temDados(ano, ufs) &&
             this.senadores.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.deputadosFederais.calculaIndice(ano, ufs, sigla) * 0.5 +
             this.senadores.calculaIndice(ano, ufs, sigla)         * 0.5;
    },

  });

  function Federal(legislativo, executivo) {
    this.legislativo = legislativo;
    this.executivo   = executivo;
  }

  herdar(Federal, Indice);

  _.extend(Federal.prototype, {

    anos: function(uf) {
      var anos = [ this.legislativo.anos(uf), this.executivo.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.legislativo.siglas(anos, ufs), this.executivo.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.legislativo.temDados(ano, ufs) &&
             this.executivo.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.legislativo.calculaIndice(ano, ufs, sigla) * 0.75 +
             this.executivo.calculaIndice(ano, ufs, sigla)  * 0.25;
    },

  });

  function LegislativoEstadual(eleicoesEstaduais, eleicoesDistritais) {
    this.eleicoesEstaduais  = eleicoesEstaduais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(LegislativoEstadual, MandatoQuatroAnos);

  _.extend(LegislativoEstadual.prototype, {

    anos: function(uf) {
      var anos = [ this.eleicoesEstaduais.anos(uf), this.eleicoesDistritais.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglasPorCargo: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.siglasDeputadosDistritais(ano, 'DF');
      } else {
        return this.eleicoesEstaduais.siglasDeputadosEstaduais(ano, uf);
      }
    },

    valorTotal: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
      } else {
        return this.eleicoesEstaduais.totalPopulacao(ano, uf);
      }
    },

    valorPorSigla: function(ano, uf, sigla) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.deputadosDistritaisProporcionalAPopulacao(ano, 'DF', sigla);
      } else {
        return this.eleicoesEstaduais.deputadosEstaduaisProporcionalAPopulacao(ano, uf, sigla);
      }
    },

  });

  function ExecutivoEstadual(eleicoesEstaduais, eleicoesDistritais) {
    this.eleicoesEstaduais  = eleicoesEstaduais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(ExecutivoEstadual, MandatoQuatroAnos);

  _.extend(ExecutivoEstadual.prototype, {

    anos: function(uf) {
      var anos = [ this.eleicoesEstaduais.anos(uf), this.eleicoesDistritais.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglasPorCargo: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.siglasGovernadores(ano, 'DF');
      } else {
        return this.eleicoesEstaduais.siglasGovernadores(ano, uf);
      }
    },

    valorTotal: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
      } else {
        return this.eleicoesEstaduais.totalPopulacao(ano, uf);
      }
    },

    valorPorSigla: function(ano, uf, sigla) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.governadoresProporcionalAPopulacao(ano, 'DF', sigla);
      } else {
        return this.eleicoesEstaduais.governadoresProporcionalAPopulacao(ano, uf, sigla);
      }
    },

  });

  function Estadual(legislativo, executivo) {
    this.legislativo = legislativo;
    this.executivo   = executivo;
  }

  herdar(Estadual, Indice);

  _.extend(Estadual.prototype, {

    anos: function(uf) {
      var anos = [ this.legislativo.anos(uf), this.executivo.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.legislativo.siglas(anos, ufs), this.executivo.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.legislativo.temDados(ano, ufs) &&
             this.executivo.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.legislativo.calculaIndice(ano, ufs, sigla) * 0.75 +
             this.executivo.calculaIndice(ano, ufs, sigla)   * 0.25;
    },

  });

  function LegislativoMunicipal(eleicoesMunicipais, eleicoesDistritais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(LegislativoMunicipal, MandatoQuatroAnos);

  _.extend(LegislativoMunicipal.prototype, {

    anos: function(uf) {
      var anos = [ this.eleicoesMunicipais.anos(uf), this.eleicoesDistritais.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglasPorCargo: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.siglasDeputadosDistritais(ano, 'DF');
      } else {
        return this.eleicoesMunicipais.siglasVereadores(ano, uf);
      }
    },

    valorTotal: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
      } else {
        return this.eleicoesMunicipais.totalPopulacao(ano, uf);
      }
    },

    valorPorSigla: function(ano, uf, sigla) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.deputadosDistritaisProporcionalAPopulacao(ano, 'DF', sigla);
      } else {
        return this.eleicoesMunicipais.vereadoresProporcionalAPopulacao(ano, uf, sigla);
      }
    },

  });

  function ExecutivoMunicipal(eleicoesMunicipais, eleicoesDistritais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  herdar(ExecutivoMunicipal, MandatoQuatroAnos);

  _.extend(ExecutivoMunicipal.prototype, {

    anos: function(uf) {
      var anos = [ this.eleicoesMunicipais.anos(uf), this.eleicoesDistritais.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglasPorCargo: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.siglasGovernadores(ano, 'DF');
      } else {
        return this.eleicoesMunicipais.siglasPrefeitos(ano, uf);
      }
    },

    valorTotal: function(ano, uf) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
      } else {
        return this.eleicoesMunicipais.totalPopulacao(ano, uf);
      }
    },

    valorPorSigla: function(ano, uf, sigla) {
      if (uf === 'DF') {
        return this.eleicoesDistritais.governadoresProporcionalAPopulacao(ano, 'DF', sigla);
      } else {
        return this.eleicoesMunicipais.prefeitosProporcionalAPopulacao(ano, uf, sigla);
      }
    },

  });

  function Municipal(legislativo, executivo) {
    this.legislativo = legislativo;
    this.executivo   = executivo;
  }

  herdar(Municipal, Indice);

  _.extend(Municipal.prototype, {

    anos: function(uf) {
      var anos = [ this.legislativo.anos(uf), this.executivo.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.legislativo.siglas(anos, ufs), this.executivo.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.legislativo.temDados(ano, ufs) &&
             this.executivo.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.legislativo.calculaIndice(ano, ufs, sigla) * 0.75 +
             this.executivo.calculaIndice(ano, ufs, sigla)   * 0.25;
    },

  });

  function Legislativo(federal, estadual, municipal) {
    this.federal   = federal;
    this.estadual  = estadual;
    this.municipal = municipal;
  }

  herdar(Legislativo, Indice);

  _.extend(Legislativo.prototype, {

    anos: function(uf) {
      var anos = [ this.federal.anos(uf), this.estadual.anos(uf), this.municipal.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.federal.siglas(anos, ufs), this.estadual.siglas(anos, ufs), this.municipal.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.federal.temDados(ano, ufs) &&
             this.estadual.temDados(ano, ufs) &&
             this.municipal.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.federal.calculaIndice(ano, ufs, sigla)   / 3 +
             this.estadual.calculaIndice(ano, ufs, sigla)  / 3 +
             this.municipal.calculaIndice(ano, ufs, sigla) / 3;
    },

  });

  function Executivo(federal, estadual, municipal) {
    this.federal   = federal;
    this.estadual  = estadual;
    this.municipal = municipal;
  }

  herdar(Executivo, Indice);

  _.extend(Executivo.prototype, {

    anos: function(uf) {
      var anos = [ this.federal.anos(uf), this.estadual.anos(uf), this.municipal.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.federal.siglas(anos, ufs), this.estadual.siglas(anos, ufs), this.municipal.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.federal.temDados(ano, ufs) &&
             this.estadual.temDados(ano, ufs) &&
             this.municipal.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.federal.calculaIndice(ano, ufs, sigla)   / 3 +
             this.estadual.calculaIndice(ano, ufs, sigla)  / 3 +
             this.municipal.calculaIndice(ano, ufs, sigla) / 3;
    },

  });

  function Total(federal, estadual, municipal) {
    this.federal   = federal;
    this.estadual  = estadual;
    this.municipal = municipal;
  }

  herdar(Total, Indice);


  _.extend(Total.prototype, {

    anos: function(uf) {
      var anos = [ this.federal.anos(uf), this.estadual.anos(uf), this.municipal.anos(uf) ];
      return _.uniq(_.flatten(anos)).sort();
    },

    siglas: function(anos, ufs) {
      var siglas = [ this.federal.siglas(anos, ufs), this.estadual.siglas(anos, ufs), this.municipal.siglas(anos, ufs) ];
      return _.uniq(_.flatten(siglas));
    },

    temDados: function(ano, ufs) {
      return this.federal.temDados(ano, ufs) &&
             this.estadual.temDados(ano, ufs) &&
             this.municipal.temDados(ano, ufs);
    },

    calculaIndice: function(ano, ufs, sigla) {
      return this.federal.calculaIndice(ano, ufs, sigla)   / 3 +
             this.estadual.calculaIndice(ano, ufs, sigla)  / 3 +
             this.municipal.calculaIndice(ano, ufs, sigla) / 3;
    },

  });

  function GeradorDeIndices(eleitos) {
    this.eleitos = eleitos;

    this.presidenciais = new EleicoesPresidenciais(this.eleitos.presidenciais);
    this.federais      = new EleicoesFederais(this.eleitos.federais);
    this.estaduais     = new EleicoesEstaduais(this.eleitos.estaduais);
    this.distritais    = new EleicoesDistritais(this.eleitos.distritais);
    this.municipais    = new EleicoesMunicipais(this.eleitos.municipais);
  }

  _.extend(GeradorDeIndices.prototype, {

    deputadosFederais: function() {
      if (this._deputadosFederais == null) {
        this._deputadosFederais = new DeputadosFederais(this.federais);
      }
      return this._deputadosFederais;
    },

    senadores: function() {
      if (this._senadores == null) {
        this._senadores = new Senadores(this.federais);
      }
      return this._senadores;
    },

    legislativoFederal: function() {
      if (this._legislativoFederal == null) {
        this._legislativoFederal = new LegislativoFederal(this.deputadosFederais(), this.senadores());
      }
      return this._legislativoFederal;
    },

    executivoFederal: function() {
      if (this._executivoFederal == null) {
        this._executivoFederal = new Presidentes(this.presidenciais);
      }
      return this._executivoFederal;
    },

    federal: function() {
      if (this._federal == null) {
        this._federal = new Federal(this.legislativoFederal(), this.executivoFederal());
      }
      return this._federal;
    },

    legislativoEstadual: function() {
      if (this._legislativoEstadual == null) {
        this._legislativoEstadual = new LegislativoEstadual(this.estaduais, this.distritais);
      }
      return this._legislativoEstadual;
    },

    executivoEstadual: function() {
      if (this._executivoEstadual == null) {
        this._executivoEstadual = new ExecutivoEstadual(this.estaduais, this.distritais);
      }
      return this._executivoEstadual;
    },

    estadual: function() {
      if (this._estadual == null) {
        this._estadual = new Estadual(this.legislativoEstadual(), this.executivoEstadual());
      }
      return this._estadual;
    },

    legislativoMunicipal: function() {
      if (this._legislativoMunicipal == null) {
        this._legislativoMunicipal = new LegislativoMunicipal(this.municipais, this.distritais);
      }
      return this._legislativoMunicipal;
    },

    executivoMunicipal: function() {
      if (this._executivoMunicipal == null) {
        this._executivoMunicipal = new ExecutivoMunicipal(this.municipais, this.distritais);
      }
      return this._executivoMunicipal;
    },

    municipal: function() {
      if (this._municipal == null) {
        this._municipal = new Municipal(this.legislativoMunicipal(), this.executivoMunicipal());
      }
      return this._municipal;
    },

    legislativo: function() {
      if (this._legislativo == null) {
        this._legislativo = new Legislativo(this.legislativoFederal(), this.legislativoEstadual(), this.legislativoMunicipal());
      }
      return this._legislativo;
    },

    executivo: function() {
      if (this._executivo == null) {
        this._executivo = new Executivo(this.executivoFederal(), this.executivoEstadual(), this.executivoMunicipal());
      }
      return this._executivo;
    },

    indice: function() {
      if (this._indice == null) {
        this._indice = new Total(this.federal(), this.estadual(), this.municipal());
      }
      return this._indice;
    },

  });

  this.GeradorDeIndices = GeradorDeIndices;

}.call(this, _));
