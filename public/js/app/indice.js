/* globals _ */

(function(_) {
  'use strict';

  // Realiza herança, copiado do CoffeeScript
  function _extends(child, parent) {
    function Constructor() { this.constructor = child; }
    Constructor.prototype = parent.prototype;
    child.prototype = new Constructor();
  }

  function Eleicoes(json) {
    this.json = json;
  }

  Eleicoes.prototype.anos = function(uf) {

    var _this = this;

    var anos = _.keys(this.json);

    var anosComUf = (uf == null || uf === '_BR') ? anos : _.filter(anos, function(ano) {
      return uf in _this.json[ano];
    });

    return _.map(anosComUf, function(ano) {
      return parseInt(ano, 10);
    });

  };

  Eleicoes.prototype.siglas = function(cargo, ano, uf) {

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

  };

  Eleicoes.prototype.dadosPorSigla = function(cargo, tipo, ano, uf) {

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

  };

  Eleicoes.prototype.total = function(cargo, ano, uf) {

    if (!(ano.toString() in this.json)) {
      return 0;
    }

    var chave = "total_" + cargo;
    if (uf != null) {
      if (uf in this.json[ano.toString()]) {
        return this.json[ano.toString()][uf][chave];
      } else {
        return 0.0;
      }
    } else {
      return this.json[ano.toString()]._BR[chave];
    }

  };

  Eleicoes.prototype.totalPopulacao = function(ano, uf) {
    return this.total('populacao', ano, uf);
  };

  function EleicoesPresidenciais() {
    Eleicoes.prototype.constructor.apply(this, arguments);
  }

  _extends(EleicoesPresidenciais, Eleicoes);

  EleicoesPresidenciais.prototype.anos = function() {
    return _.map(_.keys(this.json), function(ano) { return parseInt(ano, 10); });
  };

  EleicoesPresidenciais.prototype.siglasPresidentes = function(ano) {
    return ano.toString() in this.json ? [ this.json[ano.toString()] ] : [];
  };

  EleicoesPresidenciais.prototype.totalPresidentes = function(ano) {
    return ano.toString() in this.json ? 1 : 0;
  };

  EleicoesPresidenciais.prototype.presidentes = function(ano, sigla) {
    return this.json[ano.toString()] === sigla ? 1 : 0;
  };

  function EleicoesFederais() {
    Eleicoes.prototype.constructor.apply(this, arguments);
  }

  _extends(EleicoesFederais, Eleicoes);

  EleicoesFederais.prototype.anos = function() {
    return _.map(_.keys(this.json), function(ano) { return parseInt(ano, 10); });
  };

  EleicoesFederais.prototype.siglasDeputadosFederais = function(ano) {
    return this.siglas('deputados_federais', ano);
  };

  EleicoesFederais.prototype.siglasSenadores = function(ano) {
    return this.siglas('senadores', ano);
  };

  EleicoesFederais.prototype.totalDeputadosFederais = function(ano) {
    return this.total('deputados_federais', ano);
  };

  EleicoesFederais.prototype.totalSenadores = function(ano) {
    return this.total('senadores', ano);
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

  function EleicoesEstaduais() {
    Eleicoes.prototype.constructor.apply(this, arguments);
  }

  _extends(EleicoesEstaduais, Eleicoes);

  EleicoesEstaduais.prototype.siglasDeputadosEstaduais = function(ano, uf) {
    return this.siglas('deputados_estaduais', ano, uf);
  };

  EleicoesEstaduais.prototype.siglasGovernadores = function(ano, uf) {
    return this.siglas('governadores', ano, uf);
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

  EleicoesEstaduais.prototype.governadoresProporcionalAPopulacao = function(ano, uf, sigla) {
    return this.dadosPorSigla('governadores', 'peso_populacao', ano, uf)[sigla] || 0;
  };

  function EleicoesDistritais() {
    Eleicoes.prototype.constructor.apply(this, arguments);
  }

  _extends(EleicoesDistritais, Eleicoes);

  EleicoesDistritais.prototype.siglasDeputadosDistritais = function(ano, uf) {
    return this.siglas('deputados_distritais', ano, uf);
  };

  EleicoesDistritais.prototype.siglasGovernadores = function(ano, uf) {
    return this.siglas('governadores', ano, uf);
  };

  EleicoesDistritais.prototype.totalDeputadosDistritais = function(ano, uf) {
    return this.total('deputados_distritais', ano, uf);
  };

  EleicoesDistritais.prototype.totalGovernadores = function(ano, uf) {
    return this.total('governadores', ano, uf);
  };

  EleicoesDistritais.prototype.deputadosDistritais = function(ano, uf, sigla) {
    return this.dadosPorSigla('deputados_distritais', null, ano, uf)[sigla] || 0;
  };

  EleicoesDistritais.prototype.governadores = function(ano, uf, sigla) {
    return this.dadosPorSigla('governadores', null, ano, uf)[sigla] || 0;
  };

  EleicoesDistritais.prototype.deputadosDistritaisProporcionalAPopulacao = function(ano, uf, sigla) {
    return this.dadosPorSigla('deputados_distritais', 'peso_populacao', ano, uf)[sigla] || 0;
  };

  EleicoesDistritais.prototype.governadoresProporcionalAPopulacao = function(ano, uf, sigla) {
    return this.dadosPorSigla('governadores', 'peso_populacao', ano, uf)[sigla] || 0;
  };

  function EleicoesMunicipais() {
    Eleicoes.prototype.constructor.apply(this, arguments);
  }

  _extends(EleicoesMunicipais, Eleicoes);

  EleicoesMunicipais.prototype.siglasVereadores = function(ano, uf) {
    return this.siglas('vereadores', ano, uf);
  };

  EleicoesMunicipais.prototype.siglasPrefeitos = function(ano, uf) {
    return this.siglas('prefeitos', ano, uf);
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

  EleicoesMunicipais.prototype.prefeitosProporcionalAPopulacao = function(ano, uf, sigla) {
    return this.dadosPorSigla('prefeitos', 'peso_populacao', ano, uf)[sigla] || 0;
  };

  function Indice() {}

  Indice.prototype.anos = function(uf) { return []; };
  Indice.prototype.siglas = function(anos, ufs) { return []; };
  Indice.prototype.temDados = function(ano, ufs) { return false; };
  Indice.prototype.calculaIndice = function(ano, ufs, sigla) { return 0.0; };

  function MandatoQuatroAnos() {}

  _extends(MandatoQuatroAnos, Indice);

  MandatoQuatroAnos.prototype.valorTotal = function(ano, uf) { return 0; };
  MandatoQuatroAnos.prototype.valorPorSigla = function(ano, uf, sigla) { return 0; };

  MandatoQuatroAnos.prototype.siglas = function(anos, ufs) {

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

  };

  MandatoQuatroAnos.prototype.temDados = function(ano, ufs) {

    var _this = this;

    // Eleições que ainda teria mandato
    var anos = _.range(ano, ano - 4, -1);

    return _.every(ufs, function(uf) {
      return _.some(anos, function(ano) {
        return _this.valorTotal(ano, uf) > 0;
      });
    });

  };

  MandatoQuatroAnos.prototype.calculaIndice = function(ano, ufs, sigla) {

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

  };

  function MandatoOitoAnos() {}

  _extends(MandatoOitoAnos, Indice);

  MandatoOitoAnos.prototype.valorTotal = function(ano, uf) { return 0; };
  MandatoOitoAnos.prototype.valorPorSigla = function(ano, uf, sigla) { return 0; };

  MandatoOitoAnos.prototype.siglas = function(anos, ufs) {

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

  };

  MandatoOitoAnos.prototype.temDados = function(ano, ufs) {

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

  };

  MandatoOitoAnos.prototype.calculaIndice = function(ano, ufs, sigla) {

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

  };

  function DeputadosFederais(eleicoesFederais) {
    this.eleicoesFederais = eleicoesFederais;
  }

  _extends(DeputadosFederais, MandatoQuatroAnos);

  DeputadosFederais.prototype.anos = function() {
    return this.eleicoesFederais.anos();
  };

  DeputadosFederais.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesFederais.siglasDeputadosFederais(ano);
  };

  DeputadosFederais.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesFederais.totalDeputadosFederais(ano);
  };

  DeputadosFederais.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesFederais.deputadosFederais(ano, sigla);
  };

  function Senadores(eleicoesFederais) {
    this.eleicoesFederais = eleicoesFederais;
  }

  _extends(Senadores, MandatoOitoAnos);

  Senadores.prototype.anos = function() {
    return this.eleicoesFederais.anos();
  };

  Senadores.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesFederais.siglasSenadores(ano);
  };

  Senadores.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesFederais.totalSenadores(ano);
  };

  Senadores.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesFederais.senadores(ano, sigla);
  };

  function Presidentes(eleicoesPresidenciais) {
    this.eleicoesPresidenciais = eleicoesPresidenciais;
  }

  _extends(Presidentes, MandatoQuatroAnos);

  Presidentes.prototype.anos = function(uf) {
    return this.eleicoesPresidenciais.anos(uf);
  };

  Presidentes.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesPresidenciais.siglasPresidentes(ano);
  };

  Presidentes.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesPresidenciais.totalPresidentes(ano);
  };

  Presidentes.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesPresidenciais.presidentes(ano, sigla);
  };

  function DeputadosEstaduais(eleicoesEstaduais) {
    this.eleicoesEstaduais = eleicoesEstaduais;
  }

  _extends(DeputadosEstaduais, MandatoQuatroAnos);

  DeputadosEstaduais.prototype.anos = function(uf) {
    return this.eleicoesEstaduais.anos(uf);
  };

  DeputadosEstaduais.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesEstaduais.siglasDeputadosEstaduais(ano);
  };

  DeputadosEstaduais.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesEstaduais.totalDeputadosEstaduais(ano);
  };

  DeputadosEstaduais.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesEstaduais.deputadosEstaduais(ano, sigla);
  };

  function GovernadoresEstaduais(eleicoesEstaduais) {
    this.eleicoesEstaduais = eleicoesEstaduais;
  }

  _extends(DeputadosEstaduais, MandatoQuatroAnos);

  GovernadoresEstaduais.prototype.anos = function(uf) {
    return this.eleicoesEstaduais.anos(uf);
  };

  GovernadoresEstaduais.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesEstaduais.siglasGovernadores(ano);
  };

  GovernadoresEstaduais.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesEstaduais.totalGovernadores(ano);
  };

  GovernadoresEstaduais.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesEstaduais.governadores(ano, sigla);
  };

  function DeputadosDistritais(eleicoesDistritais) {
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(DeputadosDistritais, MandatoQuatroAnos);

  DeputadosDistritais.prototype.anos = function(uf) {
    return this.eleicoesDistritais.anos(uf);
  };

  DeputadosDistritais.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesDistritais.siglasDeputadosDistritais(ano);
  };

  DeputadosDistritais.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesDistritais.totalDeputadosDistritais(ano);
  };

  DeputadosDistritais.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesDistritais.deputadosDistritais(ano, sigla);
  };

  function GovernadoresDistritais(eleicoesDistritais) {
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(GovernadoresDistritais, MandatoQuatroAnos);

  GovernadoresDistritais.prototype.anos = function(uf) {
    return this.eleicoesDistritais.anos(uf);
  };

  GovernadoresDistritais.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesDistritais.siglasGovernadores(ano);
  };

  GovernadoresDistritais.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesDistritais.totalGovernadores(ano);
  };

  GovernadoresDistritais.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesDistritais.governadores(ano, sigla);
  };

  function Vereadores(eleicoesMunicipais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
  }

  _extends(Vereadores, MandatoQuatroAnos);

  Vereadores.prototype.anos = function(uf) {
    return this.eleicoesMunicipais.anos(uf);
  };

  Vereadores.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesMunicipais.siglasVereadores(ano);
  };

  Vereadores.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesMunicipais.totalVereadores(ano);
  };

  Vereadores.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesMunicipais.vereadores(ano, sigla);
  };

  function Prefeitos(eleicoesMunicipais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
  }

  _extends(Prefeitos, MandatoQuatroAnos);

  Prefeitos.prototype.anos = function(uf) {
    return this.eleicoesMunicipais.anos(uf);
  };

  Prefeitos.prototype.siglasPorCargo = function(ano, uf) {
    return this.eleicoesMunicipais.siglasPrefeitos(ano);
  };

  Prefeitos.prototype.valorTotal = function(ano, uf) {
    return this.eleicoesMunicipais.totalPrefeitos(ano);
  };

  Prefeitos.prototype.valorPorSigla = function(ano, uf, sigla) {
    return this.eleicoesMunicipais.prefeitos(ano, sigla);
  };

  function LegislativoFederal(deputadosFederais, senadores) {
    this.deputadosFederais = deputadosFederais;
    this.senadores         = senadores;
  }

  _extends(LegislativoFederal, Indice);

  LegislativoFederal.prototype.anos = function() {
    var anos = [ this.deputadosFederais.anos(), this.senadores.anos() ];
    return _.uniq(_.flatten(anos)).sort();
  };

  LegislativoFederal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.deputadosFederais.siglas(anos, ufs), this.senadores.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  LegislativoFederal.prototype.temDados = function(ano, ufs) {
    return this.deputadosFederais.temDados(ano, ufs) &&
           this.senadores.temDados(ano, ufs);
  };

  LegislativoFederal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.deputadosFederais.calculaIndice(ano, ufs, sigla) * 0.5 +
           this.senadores.calculaIndice(ano, ufs, sigla)         * 0.5;
  };

  function IndiceFederal(legislativoFederal, executivoFederal) {
    this.legislativoFederal = legislativoFederal;
    this.executivoFederal   = executivoFederal;
  }

  _extends(IndiceFederal, Indice);

  IndiceFederal.prototype.anos = function(uf) {
    var anos = [ this.legislativoFederal.anos(uf), this.executivoFederal.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  IndiceFederal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.legislativoFederal.siglas(anos, ufs), this.executivoFederal.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  IndiceFederal.prototype.temDados = function(ano, ufs) {
    return this.legislativoFederal.temDados(ano, ufs) &&
           this.executivoFederal.temDados(ano, ufs);
  };

  IndiceFederal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.legislativoFederal.calculaIndice(ano, ufs, sigla) * 0.75 +
           this.executivoFederal.calculaIndice(ano, ufs, sigla)  * 0.25;
  };

  function LegislativoEstadual(eleicoesEstaduais, eleicoesDistritais) {
    this.eleicoesEstaduais  = eleicoesEstaduais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(LegislativoEstadual, MandatoQuatroAnos);

  LegislativoEstadual.prototype.anos = function(uf) {
    var anos = [ this.eleicoesEstaduais.anos(uf), this.eleicoesDistritais.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  LegislativoEstadual.prototype.siglasPorCargo = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.siglasDeputadosDistritais(ano, 'DF');
    } else {
      return this.eleicoesEstaduais.siglasDeputadosEstaduais(ano, uf);
    }
  };

  LegislativoEstadual.prototype.valorTotal = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
    } else {
      return this.eleicoesEstaduais.totalPopulacao(ano, uf);
    }
  };

  LegislativoEstadual.prototype.valorPorSigla = function(ano, uf, sigla) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.deputadosDistritaisProporcionalAPopulacao(ano, 'DF', sigla);
    } else {
      return this.eleicoesEstaduais.deputadosEstaduaisProporcionalAPopulacao(ano, uf, sigla);
    }
  };

  function ExecutivoEstadual(eleicoesEstaduais, eleicoesDistritais) {
    this.eleicoesEstaduais  = eleicoesEstaduais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(ExecutivoEstadual, MandatoQuatroAnos);

  ExecutivoEstadual.prototype.anos = function(uf) {
    var anos = [ this.eleicoesEstaduais.anos(uf), this.eleicoesDistritais.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  ExecutivoEstadual.prototype.siglasPorCargo = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.siglasGovernadores(ano, 'DF');
    } else {
      return this.eleicoesEstaduais.siglasGovernadores(ano, uf);
    }
  };

  ExecutivoEstadual.prototype.valorTotal = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
    } else {
      return this.eleicoesEstaduais.totalPopulacao(ano, uf);
    }
  };

  ExecutivoEstadual.prototype.valorPorSigla = function(ano, uf, sigla) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.governadoresProporcionalAPopulacao(ano, 'DF', sigla);
    } else {
      return this.eleicoesEstaduais.governadoresProporcionalAPopulacao(ano, uf, sigla);
    }
  };

  function IndiceEstadual(legislativoEstadual, executivoEstadual) {
    this.legislativoEstadual = legislativoEstadual;
    this.executivoEstadual   = executivoEstadual;
  }

  _extends(IndiceEstadual, Indice);

  IndiceEstadual.prototype.anos = function(uf) {
    var anos = [ this.legislativoEstadual.anos(uf), this.executivoEstadual.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  IndiceEstadual.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.legislativoEstadual.siglas(anos, ufs), this.executivoEstadual.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  IndiceEstadual.prototype.temDados = function(ano, ufs) {
    return this.legislativoEstadual.temDados(ano, ufs) &&
           this.executivoEstadual.temDados(ano, ufs);
  };

  IndiceEstadual.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.legislativoEstadual.calculaIndice(ano, ufs, sigla) * 0.75 +
           this.executivoEstadual.calculaIndice(ano, ufs, sigla)   * 0.25;
  };

  function LegislativoMunicipal(eleicoesMunicipais, eleicoesDistritais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(LegislativoMunicipal, MandatoQuatroAnos);

  LegislativoMunicipal.prototype.anos = function(uf) {
    var anos = [ this.eleicoesMunicipais.anos(uf), this.eleicoesDistritais.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  LegislativoMunicipal.prototype.siglasPorCargo = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.siglasDeputadosDistritais(ano, 'DF');
    } else {
      return this.eleicoesMunicipais.siglasVereadores(ano, uf);
    }
  };

  LegislativoMunicipal.prototype.valorTotal = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
    } else {
      return this.eleicoesMunicipais.totalPopulacao(ano, uf);
    }
  };

  LegislativoMunicipal.prototype.valorPorSigla = function(ano, uf, sigla) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.deputadosDistritaisProporcionalAPopulacao(ano, 'DF', sigla);
    } else {
      return this.eleicoesMunicipais.vereadoresProporcionalAPopulacao(ano, uf, sigla);
    }
  };

  function ExecutivoMunicipal(eleicoesMunicipais, eleicoesDistritais) {
    this.eleicoesMunicipais = eleicoesMunicipais;
    this.eleicoesDistritais = eleicoesDistritais;
  }

  _extends(ExecutivoMunicipal, MandatoQuatroAnos);

  ExecutivoMunicipal.prototype.anos = function(uf) {
    var anos = [ this.eleicoesMunicipais.anos(uf), this.eleicoesDistritais.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  ExecutivoMunicipal.prototype.siglasPorCargo = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.siglasGovernadores(ano, 'DF');
    } else {
      return this.eleicoesMunicipais.siglasPrefeitos(ano, uf);
    }
  };

  ExecutivoMunicipal.prototype.valorTotal = function(ano, uf) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.totalPopulacao(ano, 'DF');
    } else {
      return this.eleicoesMunicipais.totalPopulacao(ano, uf);
    }
  };

  ExecutivoMunicipal.prototype.valorPorSigla = function(ano, uf, sigla) {
    if (uf === 'DF') {
      return this.eleicoesDistritais.governadoresProporcionalAPopulacao(ano, 'DF', sigla);
    } else {
      return this.eleicoesMunicipais.prefeitosProporcionalAPopulacao(ano, uf, sigla);
    }
  };

  function IndiceMunicipal(legislativoMunicipal, executivoMunicipal) {
    this.legislativoMunicipal = legislativoMunicipal;
    this.executivoMunicipal   = executivoMunicipal;
  }

  _extends(IndiceMunicipal, Indice);

  IndiceMunicipal.prototype.anos = function(uf) {
    var anos = [ this.legislativoMunicipal.anos(uf), this.executivoMunicipal.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  IndiceMunicipal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.legislativoMunicipal.siglas(anos, ufs), this.executivoMunicipal.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  IndiceMunicipal.prototype.temDados = function(ano, ufs) {
    return this.legislativoMunicipal.temDados(ano, ufs) &&
           this.executivoMunicipal.temDados(ano, ufs);
  };

  IndiceMunicipal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.legislativoMunicipal.calculaIndice(ano, ufs, sigla) * 0.75 +
           this.executivoMunicipal.calculaIndice(ano, ufs, sigla)   * 0.25;
  };

  function LegislativoTotal(legislativoFederal, legislativoEstadual, legislativoMunicipal) {
    this.legislativoFederal   = legislativoFederal;
    this.legislativoEstadual  = legislativoEstadual;
    this.legislativoMunicipal = legislativoMunicipal;
  }

  _extends(LegislativoTotal, Indice);

  LegislativoTotal.prototype.anos = function(uf) {
    var anos = [ this.legislativoFederal.anos(uf), this.legislativoEstadual.anos(uf), this.legislativoMunicipal.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  LegislativoTotal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.legislativoFederal.siglas(anos, ufs), this.legislativoEstadual.siglas(anos, ufs), this.legislativoMunicipal.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  LegislativoTotal.prototype.temDados = function(ano, ufs) {
    return this.legislativoFederal.temDados(ano, ufs) &&
           this.legislativoEstadual.temDados(ano, ufs) &&
           this.legislativoMunicipal.temDados(ano, ufs);
  };

  LegislativoTotal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.legislativoFederal.calculaIndice(ano, ufs, sigla)   / 3 +
           this.legislativoEstadual.calculaIndice(ano, ufs, sigla)  / 3 +
           this.legislativoMunicipal.calculaIndice(ano, ufs, sigla) / 3;
  };

  function ExecutivoTotal(executivoFederal, executivoEstadual, executivoMunicipal) {
    this.executivoFederal   = executivoFederal;
    this.executivoEstadual  = executivoEstadual;
    this.executivoMunicipal = executivoMunicipal;
  }

  _extends(ExecutivoTotal, Indice);

  ExecutivoTotal.prototype.anos = function(uf) {
    var anos = [ this.executivoFederal.anos(uf), this.executivoEstadual.anos(uf), this.executivoMunicipal.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  ExecutivoTotal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.executivoFederal.siglas(anos, ufs), this.executivoEstadual.siglas(anos, ufs), this.executivoMunicipal.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  ExecutivoTotal.prototype.temDados = function(ano, ufs) {
    return this.executivoFederal.temDados(ano, ufs) &&
           this.executivoEstadual.temDados(ano, ufs) &&
           this.executivoMunicipal.temDados(ano, ufs);
  };

  ExecutivoTotal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.executivoFederal.calculaIndice(ano, ufs, sigla)   / 3 +
           this.executivoEstadual.calculaIndice(ano, ufs, sigla)  / 3 +
           this.executivoMunicipal.calculaIndice(ano, ufs, sigla) / 3;
  };

  _extends(IndiceTotal, Indice);

  function IndiceTotal(indiceFederal, indiceEstadual, indiceMunicipal) {
    this.indiceFederal   = indiceFederal;
    this.indiceEstadual  = indiceEstadual;
    this.indiceMunicipal = indiceMunicipal;
  }

  IndiceTotal.prototype.anos = function(uf) {
    var anos = [ this.indiceFederal.anos(uf), this.indiceEstadual.anos(uf), this.indiceMunicipal.anos(uf) ];
    return _.uniq(_.flatten(anos)).sort();
  };

  IndiceTotal.prototype.siglas = function(anos, ufs) {
    var siglas = [ this.indiceFederal.siglas(anos, ufs), this.indiceEstadual.siglas(anos, ufs), this.indiceMunicipal.siglas(anos, ufs) ];
    return _.uniq(_.flatten(siglas));
  };

  IndiceTotal.prototype.temDados = function(ano, ufs) {
    return this.indiceFederal.temDados(ano, ufs) &&
           this.indiceEstadual.temDados(ano, ufs) &&
           this.indiceMunicipal.temDados(ano, ufs);
  };

  IndiceTotal.prototype.calculaIndice = function(ano, ufs, sigla) {
    return this.indiceFederal.calculaIndice(ano, ufs, sigla)   / 3 +
           this.indiceEstadual.calculaIndice(ano, ufs, sigla)  / 3 +
           this.indiceMunicipal.calculaIndice(ano, ufs, sigla) / 3;
  };

  function GeradorDeIndices(eleitos) {
    this.eleitos = eleitos;

    this.presidenciais = new EleicoesPresidenciais(this.eleitos.presidenciais);
    this.federais      = new EleicoesFederais(this.eleitos.federais);
    this.estaduais     = new EleicoesEstaduais(this.eleitos.estaduais);
    this.distritais    = new EleicoesDistritais(this.eleitos.distritais);
    this.municipais    = new EleicoesMunicipais(this.eleitos.municipais);
  }

  GeradorDeIndices.prototype.deputadosFederais = function() {
    return this._deputadosFederais || (this._deputadosFederais = new DeputadosFederais(this.federais));
  };

  GeradorDeIndices.prototype.senadores = function() {
    return this._senadores || (this._senadores = new Senadores(this.federais));
  };

  GeradorDeIndices.prototype.legislativoFederal = function() {
    return this._legislativoFederal || (this._legislativoFederal = new LegislativoFederal(this.deputadosFederais(), this.senadores()));
  };

  GeradorDeIndices.prototype.executivoFederal = function() {
    return this._executivoFederal || (this._executivoFederal = new Presidentes(this.presidenciais));
  };

  GeradorDeIndices.prototype.indiceFederal = function() {
    return this._indiceFederal || (this._indiceFederal = new IndiceFederal(this.legislativoFederal(), this.executivoFederal()));
  };

  GeradorDeIndices.prototype.legislativoEstadual = function() {
    return this._legislativoEstadual || (this._legislativoEstadual = new LegislativoEstadual(this.estaduais, this.distritais));
  };

  GeradorDeIndices.prototype.executivoEstadual = function() {
    return this._executivoEstadual || (this._executivoEstadual = new ExecutivoEstadual(this.estaduais, this.distritais));
  };

  GeradorDeIndices.prototype.indiceEstadual = function() {
    return this._indiceEstadual || (this._indiceEstadual = new IndiceEstadual(this.legislativoEstadual(), this.executivoEstadual()));
  };

  GeradorDeIndices.prototype.legislativoMunicipal = function() {
    return this._legislativoMunicipal || (this._legislativoMunicipal = new LegislativoMunicipal(this.municipais, this.distritais));
  };

  GeradorDeIndices.prototype.executivoMunicipal = function() {
    return this._executivoMunicipal || (this._executivoMunicipal = new ExecutivoMunicipal(this.municipais, this.distritais));
  };

  GeradorDeIndices.prototype.indiceMunicipal = function() {
    return this._indiceMunicipal || (this._indiceMunicipal = new IndiceMunicipal(this.legislativoMunicipal(), this.executivoMunicipal()));
  };

  GeradorDeIndices.prototype.legislativoTotal = function() {
    return this._legislativoTotal || (this._legislativoTotal = new LegislativoTotal(this.legislativoFederal(), this.legislativoEstadual(), this.legislativoMunicipal()));
  };

  GeradorDeIndices.prototype.executivoTotal = function() {
    return this._executivoTotal || (this._executivoTotal = new ExecutivoTotal(this.executivoFederal(), this.executivoEstadual(), this.executivoMunicipal()));
  };

  GeradorDeIndices.prototype.indiceTotal = function() {
    return this._indiceTotal || (this._indiceTotal = new IndiceTotal(this.indiceFederal(), this.indiceEstadual(), this.indiceMunicipal()));
  };

  this.GeradorDeIndices = GeradorDeIndices;

}.call(this, _));
