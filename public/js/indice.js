;(function() {

  // Realiza herança, copiado do CoffeeScript
  var _extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  var Indice = (function() {

    function Indice() {}

    Indice.prototype.anos = function() { return [] };
    Indice.prototype.siglas = function() { return [] };
    Indice.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) { return false };
    Indice.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) { return 0.0 };

    return Indice;

  })();

  var MandatoQuatroAnos = (function() {

    _extends(MandatoQuatroAnos, Indice);

    function MandatoQuatroAnos() {}

    MandatoQuatroAnos.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) { return 0; };
    MandatoQuatroAnos.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) { return 0; };

    MandatoQuatroAnos.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      return _.some(anos, function(ano) {
        return _.some(ufs, function(uf) {
          return _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo) > 0;
        });
      });

    };

    MandatoQuatroAnos.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      var eleitos = 0, total = 0;
      _.each(anos, function(ano) {
        _.each(ufs, function(uf) {
          total   += _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo);
          eleitos += _this.valorPorSigla(ano, uf, sigla, metodoPesoUe, pesoExecutivo);
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

      var _this = this;

      // Eleições que ainda teria mandato
      var metade1 = _.range(ano,     ano - 4, -1);
      var metade2 = _.range(ano - 4, ano - 8, -1);

      // Precisa de dados de duas eleições
      return _.every([ metade1, metade2 ], function(anos) {
        return _.some(anos, function(ano) {
          return _.some(ufs, function(uf) {
            return _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo) > 0;
          });
        });
      });

    };

    MandatoOitoAnos.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 8, -1);

      var eleitos = 0, total = 0;
      _.each(anos, function(ano) {
        _.each(ufs, function(uf) {
          total   += _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo);
          eleitos += _this.valorPorSigla(ano, uf, sigla, metodoPesoUe, pesoExecutivo);
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
      return _.uniq(_.flatten([ this.deputadosFederais.siglas(), this.senadores.siglas() ]));
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
      return _.uniq(_.flatten([ this.congressoNacional.siglas(), this.presidentes.siglas() ]));
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
      return _.uniq(_.flatten([ this.deputadosEstaduais.siglas(), this.governadores.siglas() ]));
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
      return _.uniq(_.flatten([ this.eleicoes.siglasVereadores(), this.distritais.siglasDeputadosEstaduais() ]));
    };

    LegislativoMunicipal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo') {
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.totalVereadores(ano, uf);
        }
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
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.vereadores(ano, uf, sigla);
        }
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.deputadosEstaduaisProporcionalAPopulacao(ano, uf, sigla);
        } else {
          return this.eleicoes.vereadoresProporcionalAPopulacao(ano, uf, sigla);
        }
      }
    };

    LegislativoMunicipal.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      var ignoraDf = (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo' || !_.contains(ufs, 'DF'));

      var temDadosDf = ignoraDf || _.some(anos, function(ano) {
        return _this.valorTotal(ano, 'DF', metodoPesoUe, pesoExecutivo) > 0;
      });

      var ufsMenosDf = _.difference(ufs, ['DF']);

      return temDadosDf && _.some(anos, function(ano) {
        return _.some(ufsMenosDf, function(uf) {
          return _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo) > 0;
        });
      });

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
      return _.uniq(_.flatten([ this.eleicoes.siglasPrefeitos(), this.distritais.siglasGovernadores() ]));
    };

    ExecutivoMunicipal.prototype.valorTotal = function(ano, uf, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal') {
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.totalPrefeitos(ano, uf);
        }
      } else if (metodoPesoUe === 'legislativo') {
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.totalVereadores(ano, uf);
        }
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.totalPopulacao(ano, uf);
        } else {
          return this.eleicoes.totalPopulacao(ano, uf);
        }
      }
    };

    ExecutivoMunicipal.prototype.valorPorSigla = function(ano, uf, sigla, metodoPesoUe, pesoExecutivo) {
      if (metodoPesoUe === 'nominal') {
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.prefeitos(ano, uf, sigla);
        }
      } else if (metodoPesoUe === 'legislativo') {
        if (uf == 'DF') {
          return 0;
        } else {
          return this.eleicoes.prefeitosProporcionalAosVereadores(ano, uf, sigla);
        }
      } else if (metodoPesoUe === 'populacao') {
        if (uf == 'DF') {
          return this.distritais.governadoresProporcionalAPopulacao(ano, uf, sigla);
        } else {
          return this.eleicoes.prefeitosProporcionalAPopulacao(ano, uf, sigla);
        }
      }
    };

    ExecutivoMunicipal.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      var _this = this;

      // Eleições que ainda teria mandato
      var anos = _.range(ano, ano - 4, -1);

      var ignoraDf = (metodoPesoUe === 'nominal' || metodoPesoUe === 'legislativo' || !_.contains(ufs, 'DF'));

      var temDadosDf = ignoraDf || _.some(anos, function(ano) {
        return _this.valorTotal(ano, 'DF', metodoPesoUe, pesoExecutivo) > 0;
      });

      var ufsMenosDf = _.difference(ufs, ['DF']);

      return temDadosDf && _.some(anos, function(ano) {
        return _.some(ufsMenosDf, function(uf) {
          return _this.valorTotal(ano, uf, metodoPesoUe, pesoExecutivo) > 0;
        });
      });

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
      return _.uniq(_.flatten([ this.vereadores.siglas(), this.prefeitos.siglas() ]));
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

  var LegislativoNacional = (function() {

    _extends(LegislativoNacional, Indice);

    function LegislativoNacional(federais, estaduais, municipais) {
      this.federais   = federais;
      this.estaduais  = estaduais;
      this.municipais = municipais;

      this.legislativoFederal   = new LegislativoFederal(federais);
      this.legislativoEstadual  = new LegislativoEstadual(estaduais);
      this.legislativoMunicipal = new LegislativoMunicipal(municipais, estaduais);
    }

    LegislativoNacional.prototype.anos = function() {
      return _.uniq(_.flatten([ this.federais.anos(), this.estaduais.anos(), this.municipais.anos() ]));
    };

    LegislativoNacional.prototype.siglas = function() {
      return _.uniq(_.flatten([ this.legislativoFederal.siglas(), this.legislativoEstadual.siglas(), this.legislativoMunicipal.siglas() ]));
    };

    LegislativoNacional.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.legislativoFederal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.legislativoEstadual.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.legislativoMunicipal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    LegislativoNacional.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      return this.legislativoFederal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.legislativoEstadual.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.legislativoMunicipal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3;

    };

    return LegislativoNacional;

  })();

  var ExecutivoNacional = (function() {

    _extends(ExecutivoNacional, Indice);

    function ExecutivoNacional(federais, estaduais, municipais) {
      this.federais   = federais;
      this.estaduais  = estaduais;
      this.municipais = municipais;

      this.executivoFederal   = new ExecutivoFederal(federais);
      this.executivoEstadual  = new ExecutivoEstadual(estaduais);
      this.executivoMunicipal = new ExecutivoMunicipal(municipais, estaduais);
    }

    ExecutivoNacional.prototype.anos = function() {
      return _.uniq(_.flatten([ this.federais.anos(), this.estaduais.anos(), this.municipais.anos() ]));
    };

    ExecutivoNacional.prototype.siglas = function() {
      return _.uniq(_.flatten([ this.executivoFederal.siglas(), this.executivoEstadual.siglas(), this.executivoMunicipal.siglas() ]));
    };

    ExecutivoNacional.prototype.temDados = function(ano, ufs, metodoPesoUe, pesoExecutivo) {

      return this.executivoFederal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.executivoEstadual.temDados(ano, ufs, metodoPesoUe, pesoExecutivo) &&
             this.executivoMunicipal.temDados(ano, ufs, metodoPesoUe, pesoExecutivo);

    };

    ExecutivoNacional.prototype.calculaIndice = function(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) {

      return this.executivoFederal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.executivoEstadual.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3 +
             this.executivoMunicipal.calculaIndice(ano, ufs, sigla, metodoPesoUe, pesoExecutivo) / 3;

    };

    return ExecutivoNacional;

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
      return _.uniq(_.flatten([ this.federais.anos(), this.estaduais.anos(), this.municipais.anos() ]));
    };

    IndiceNacional.prototype.siglas = function() {
      return _.uniq(_.flatten([ this.indiceFederal.siglas(), this.indiceEstadual.siglas(), this.indiceMunicipal.siglas() ]));
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
    }

    Eleicoes.prototype.anos = function() {
      return _.map(_.keys(this.json), function(ano) {
        return parseInt(ano, 10);
      });
    };

    Eleicoes.prototype.siglas = function(cargo) {

      var _this = this;

      var siglasPorAno = _.map(_.keys(this.json), function(ano) {
        return _.keys(_this.json[ano]._BR[cargo + '_por_sigla']);
      });

      return _.uniq(_.flatten(siglasPorAno));
    };

    Eleicoes.prototype.dadosPorSigla = function(nome, tipo, ano, uf) {

      if (!(ano.toString() in this.json)) {
        return {};
      }

      var chave = nome + '_por_sigla' + (tipo != null ? ('_' + tipo) : '');
      if (uf != null) {
        return this.json[ano.toString()][uf][chave];
      } else {
        return this.json[ano.toString()]._BR[chave];
      }

    };

    Eleicoes.prototype.total = function(nome, ano, uf) {

      if (!(ano.toString() in this.json)) {
        return 0;
      }

      var chave = "total_" + nome;
      if (uf != null) {
        return this.json[ano.toString()][uf][chave];
      } else {
        return this.json[ano.toString()]._BR[chave];
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

    function GeradorDeIndices(eleitos) {
      this.eleitos      = eleitos;

      this.federais   = new EleicoesFederais(this.eleitos.federais);
      this.estaduais  = new EleicoesEstaduais(this.eleitos.estaduais);
      this.municipais = new EleicoesMunicipais(this.eleitos.municipais);
    }

    GeradorDeIndices.prototype.camaraDosDeputados = function() {
      return this._camaraDosDeputados || (this._camaraDosDeputados = new CamaraDosDeputados(this.federais));
    };

    GeradorDeIndices.prototype.senadoFederal = function() {
      return this._senadores || (this._senadores = new SenadoFederal(this.federais));
    };

    GeradorDeIndices.prototype.legislativoFederal = function() {
      return this._legislativoFederal || (this._legislativoFederal = new LegislativoFederal(this.federais));
    };

    GeradorDeIndices.prototype.executivoFederal = function() {
      return this._executivoFederal || (this._executivoFederal = new ExecutivoFederal(this.federais));
    };

    GeradorDeIndices.prototype.indiceFederal = function() {
      return this._indiceFederal || (this._indiceFederal = new IndiceFederal(this.federais));
    };

    GeradorDeIndices.prototype.legislativoEstadual = function() {
      return this._legislativoEstadual || (this._legislativoEstadual = new LegislativoEstadual(this.estaduais));
    };

    GeradorDeIndices.prototype.executivoEstadual = function() {
      return this._executivoEstadual || (this._executivoEstadual = new ExecutivoEstadual(this.estaduais));
    };

    GeradorDeIndices.prototype.indiceEstadual = function() {
      return this._indiceEstadual || (this._indiceEstadual = new IndiceEstadual(this.estaduais));
    };

    GeradorDeIndices.prototype.legislativoMunicipal = function() {
      return this._legislativoMunicipal || (this._legislativoMunicipal = new LegislativoMunicipal(this.municipais, this.estaduais));
    };

    GeradorDeIndices.prototype.executivoMunicipal = function() {
      return this._executivoMunicipal || (this._executivoMunicipal = new ExecutivoMunicipal(this.municipais, this.estaduais));
    };

    GeradorDeIndices.prototype.indiceMunicipal = function() {
      return this._indiceMunicipal || (this._indiceMunicipal = new IndiceMunicipal(this.municipais, this.estaduais));
    };

    GeradorDeIndices.prototype.legislativoNacional = function() {
      return this._legislativoMunicipal || (this._legislativoMunicipal = new LegislativoNacional(this.federais, this.estaduais, this.municipais));
    };

    GeradorDeIndices.prototype.executivoNacional = function() {
      return this._executivoNacional || (this._executivoNacional = new ExecutivoNacional(this.federais, this.estaduais, this.municipais));
    };

    GeradorDeIndices.prototype.indiceNacional = function() {
      return this._indiceNacional || (this._indiceNacional = new IndiceNacional(this.federais, this.estaduais, this.municipais));
    };

    return GeradorDeIndices;

  })();

})();
