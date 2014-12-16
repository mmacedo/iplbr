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

  // Retorna uma lista de anos que ocorreu eleições
  var anos = function(eleicoes) {
    return Lazy(eleicoes).keys();
  };

  // Retorna todas as siglas que já elegeram determinado cargo
  var siglas = function(eleicoes, cargo) {
    return anos(eleicoes).map(function(ano) {
      return Lazy(eleicoes[ano]["" + cargo + "_por_sigla"]).keys();
    }).flatten().uniq();
  };

  var Grafico = (function() {

    function Grafico() {}

    Grafico.prototype.anos = function() { return []; };
    Grafico.prototype.siglas = function() { return []; };
    Grafico.prototype.temDados = function(ano) { return false; };
    Grafico.prototype.temEleito = function(ano, sigla) { return false; };
    Grafico.prototype.calculaIndice = function(ano, sigla) { return 0.0; };

    Grafico.prototype.categories = function() {
      return this.anos().map(toInt).toArray();
    };

    Grafico.prototype.series = function() {

      var _this = this;

      return _this.siglas().map(function(sigla) {

        // Anos que a sigla elegeu alguém
        var anosComBancada = _this.anos().filter(function(ano) {
          return _this.temDados(ano) && _this.temEleito(ano, sigla);
        });

        // Tamanho da bancada em relação ao total da casa
        var percentualBancadaPorAno = anosComBancada.map(function(ano) {
          return [ parseInt(ano, 10), _this.calculaIndice(ano, sigla) ];
        });

        return {
          name: sigla,
          data: percentualBancadaPorAno.sort().toArray()
        };
      }).toArray();
    };

    return Grafico;

  })();

  var MandatoQuatroAnos = (function() {

    _extends(MandatoQuatroAnos, Grafico);

    function MandatoQuatroAnos(eleicoes) {
      this.eleicoes = eleicoes;
    }

    MandatoQuatroAnos.prototype.valorTotal = function(ano) { return 0; };
    MandatoQuatroAnos.prototype.valorPorSigla = function(ano, sigla) { return 0; };

    MandatoQuatroAnos.prototype.temDados = function(ano) {

      var doisAnosAntes = (parseInt(ano, 10) - 2).toString();

      return this.valorTotal(doisAnosAntes) > 0 || this.valorTotal(ano) > 0;
    };

    MandatoQuatroAnos.prototype.temEleito = function(ano, sigla) {

      var ano = this.valorTotal(ano) > 0 ? ano : (parseInt(ano, 10) - 2).toString();

      return this.valorPorSigla(ano, sigla) > 0;
    };

    MandatoQuatroAnos.prototype.calculaIndice = function(ano, sigla) {

      var ano = this.valorTotal(ano) > 0 ? ano : (parseInt(ano, 10) - 2).toString();

      var eleitos = this.valorPorSigla(ano, sigla);
      var total   = this.valorTotal(ano);

      return eleitos / total * 100;
    };

    return MandatoQuatroAnos;

  })();

  var MandatoOitoAnos = (function() {

    _extends(MandatoOitoAnos, Grafico);

    function MandatoOitoAnos(eleicoes) {
      this.eleicoes = eleicoes;
    }

    MandatoOitoAnos.prototype.valorTotal = function(ano) { return 0; };
    MandatoOitoAnos.prototype.valorPorSigla = function(ano, sigla) { return 0; };

    MandatoOitoAnos.prototype.temDados = function(ano) {

      var doisAnosAntes   = (parseInt(ano, 10) - 2).toString();
      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();
      var seisAnosAntes   = (parseInt(ano, 10) - 6).toString();

      // Só os anos que tenha todos
      return (this.valorTotal(seisAnosAntes) > 0 || this.valorTotal(quatroAnosAntes) > 0) &&
             (this.valorTotal(doisAnosAntes) > 0 || this.valorTotal(ano) > 0);
    };

    MandatoOitoAnos.prototype.temEleito = function(ano, sigla) {

      var ano = this.valorTotal(ano) > 0 ? ano : (parseInt(ano, 10) - 2).toString();

      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();

      return this.valorPorSigla(quatroAnosAntes, sigla) > 0 ||
             this.valorPorSigla(ano, sigla) > 0;
    };

    MandatoOitoAnos.prototype.calculaIndice = function(ano, sigla) {

      var ano = this.valorTotal(ano) > 0 ? ano : (parseInt(ano, 10) - 2).toString();

      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();

      var eleitos = this.valorPorSigla(quatroAnosAntes, sigla) + this.valorPorSigla(ano, sigla);
      var total   = this.valorTotal(quatroAnosAntes) + this.valorTotal(ano);

      return eleitos / total * 100;
    };

    return MandatoOitoAnos;

  })();

  var DeputadosFederais = (function() {

    _extends(DeputadosFederais, MandatoQuatroAnos);

    function DeputadosFederais(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    DeputadosFederais.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    DeputadosFederais.prototype.siglas = function() {
      return siglas(this.eleicoes, "deputados_federais");
    };

    DeputadosFederais.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_deputados_federais : 0;
    };

    DeputadosFederais.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].deputados_federais_por_sigla[sigla] || 0;
    };

    return DeputadosFederais;

  })();

  var Senadores = (function() {

    _extends(Senadores, MandatoOitoAnos);

    function Senadores(eleicoes) {
      MandatoOitoAnos.prototype.constructor.apply(this, arguments);
    }

    Senadores.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    Senadores.prototype.siglas = function() {
      return siglas(this.eleicoes, "senadores");
    };

    Senadores.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_senadores : 0;
    };

    Senadores.prototype.valorPorSigla = function(ano, sigla) {
      return ano in this.eleicoes ? (this.eleicoes[ano].senadores_por_sigla[sigla] || 0) : 0;
    };

    return Senadores;

  })();

  var CongressoNacional = (function() {

    _extends(CongressoNacional, Grafico);

    function CongressoNacional(eleicoes) {
      this.eleicoes = eleicoes;

      this.deputadosFederais = new DeputadosFederais(eleicoes);
      this.senadores         = new Senadores(eleicoes);
    }

    CongressoNacional.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    CongressoNacional.prototype.siglas = function() {
      return Lazy([ this.deputadosFederais.siglas(), this.senadores.siglas() ]).flatten().uniq();
    };

    CongressoNacional.prototype.temDados = function(ano) {

      return this.deputadosFederais.temDados(ano) &&
             this.senadores.temDados(ano);
    };

    CongressoNacional.prototype.temEleito = function(ano, sigla) {

      return this.deputadosFederais.temEleito(ano, sigla) ||
             this.senadores.temEleito(ano, sigla);
    };

    CongressoNacional.prototype.calculaIndice = function(ano, sigla) {

      return this.deputadosFederais.calculaIndice(ano, sigla) * 0.5 +
             this.senadores.calculaIndice(ano, sigla) * 0.5;
    };

    return CongressoNacional;

  })();

  var Presidentes = (function() {

    _extends(Presidentes, MandatoQuatroAnos);

    function Presidentes(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    Presidentes.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    Presidentes.prototype.siglas = function() {
      return siglas(this.eleicoes, "presidentes");
    };

    Presidentes.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_presidentes : 0;
    };

    Presidentes.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].presidentes_por_sigla[sigla] || 0;
    };

    return Presidentes;

  })();

  var IndiceFederal = (function() {

    _extends(IndiceFederal, Grafico);

    function IndiceFederal(eleicoes) {
      this.eleicoes = eleicoes;

      this.congressoNacional = new CongressoNacional(eleicoes);
      this.presidentes       = new Presidentes(eleicoes);
    }

    IndiceFederal.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    IndiceFederal.prototype.siglas = function() {
      return Lazy([ this.congressoNacional.siglas(), this.presidentes.siglas() ]).flatten().uniq();
    };

    IndiceFederal.prototype.temDados = function(ano) {

      return this.congressoNacional.temDados(ano) &&
             this.presidentes.temDados(ano);
    };

    IndiceFederal.prototype.temEleito = function(ano, sigla) {

      return this.congressoNacional.temEleito(ano, sigla) ||
             this.presidentes.temEleito(ano, sigla);
    };

    IndiceFederal.prototype.calculaIndice = function(ano, sigla) {

      return this.congressoNacional.calculaIndice(ano, sigla) * 0.75 +
             this.presidentes.calculaIndice(ano, sigla) * 0.25;
    };

    return IndiceFederal;

  })();

  var DeputadosEstaduais = (function() {

    _extends(DeputadosEstaduais, MandatoQuatroAnos);

    function DeputadosEstaduais(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    DeputadosEstaduais.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    DeputadosEstaduais.prototype.siglas = function() {
      return siglas(this.eleicoes, "deputados_estaduais");
    };

    DeputadosEstaduais.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_deputados_estaduais : 0;
    };

    DeputadosEstaduais.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].deputados_estaduais_por_sigla[sigla] || 0;
    };

    return DeputadosEstaduais;

  })();

  var Governadores = (function() {

    _extends(Governadores, MandatoQuatroAnos);

    function Governadores(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    Governadores.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    Governadores.prototype.siglas = function() {
      return siglas(this.eleicoes, "governadores");
    };

    Governadores.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_governadores : 0;
    };

    Governadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].governadores_por_sigla[sigla] || 0;
    };

    return Governadores;

  })();

  var GovernadoresComPeso = (function() {

    _extends(GovernadoresComPeso, MandatoQuatroAnos);

    function GovernadoresComPeso(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    GovernadoresComPeso.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    GovernadoresComPeso.prototype.siglas = function() {
      return siglas(this.eleicoes, "governadores");
    };

    GovernadoresComPeso.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_deputados_estaduais : 0;
    };

    GovernadoresComPeso.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].peso_dos_governadores_por_sigla[sigla] || 0;
    };

    return GovernadoresComPeso;

  })();

  var IndiceEstadual = (function() {

    _extends(IndiceEstadual, Grafico);

    function IndiceEstadual(eleicoes) {
      this.eleicoes = eleicoes;

      this.deputadosEstaduais = new DeputadosEstaduais(eleicoes);
      this.governadores       = new GovernadoresComPeso(eleicoes);
    }

    IndiceEstadual.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    IndiceEstadual.prototype.siglas = function() {
      return Lazy([ this.deputadosEstaduais.siglas(), this.governadores.siglas() ]).flatten().uniq();
    };

    IndiceEstadual.prototype.temDados = function(ano) {

      return this.deputadosEstaduais.temDados(ano) &&
             this.governadores.temDados(ano);
    };

    IndiceEstadual.prototype.temEleito = function(ano, sigla) {

      return this.deputadosEstaduais.temEleito(ano, sigla) ||
             this.governadores.temEleito(ano, sigla);
    };

    IndiceEstadual.prototype.calculaIndice = function(ano, sigla) {

      return this.deputadosEstaduais.calculaIndice(ano, sigla) * 0.75 +
             this.governadores.calculaIndice(ano, sigla) * 0.25;
    };

    return IndiceEstadual;

  })();

  var Vereadores = (function() {

    _extends(Vereadores, MandatoQuatroAnos);

    function Vereadores(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    Vereadores.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    Vereadores.prototype.siglas = function() {
      return siglas(this.eleicoes, "vereadores");
    };

    Vereadores.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_vereadores : 0;
    };

    Vereadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].vereadores_por_sigla[sigla] || 0;
    };

    return Vereadores;

  })();

  var Prefeitos = (function() {

    _extends(Prefeitos, MandatoQuatroAnos);

    function Prefeitos(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    Prefeitos.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    Prefeitos.prototype.siglas = function() {
      return siglas(this.eleicoes, "prefeitos");
    };

    Prefeitos.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_prefeitos : 0;
    };

    Prefeitos.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].prefeitos_por_sigla[sigla] || 0;
    };

    return Prefeitos;

  })();

  var PrefeitosComPeso = (function() {

    _extends(PrefeitosComPeso, MandatoQuatroAnos);

    function PrefeitosComPeso(eleicoes) {
      MandatoQuatroAnos.prototype.constructor.apply(this, arguments);
    }

    PrefeitosComPeso.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    PrefeitosComPeso.prototype.siglas = function() {
      return siglas(this.eleicoes, "prefeitos");
    };

    PrefeitosComPeso.prototype.valorTotal = function(ano) {
      return ano in this.eleicoes ? this.eleicoes[ano].total_vereadores : 0;
    };

    PrefeitosComPeso.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].peso_dos_prefeitos_por_sigla[sigla] || 0;
    };

    return PrefeitosComPeso;

  })();

  var IndiceMunicipal = (function() {

    _extends(IndiceMunicipal, Grafico);

    function IndiceMunicipal(eleicoes) {
      this.eleicoes = eleicoes;

      this.vereadores = new Vereadores(eleicoes);
      this.prefeitos  = new PrefeitosComPeso(eleicoes);
    }

    IndiceMunicipal.prototype.anos = function() {
      return anos(this.eleicoes);
    };

    IndiceMunicipal.prototype.siglas = function() {
      return Lazy([ this.vereadores.siglas(), this.prefeitos.siglas() ]).flatten().uniq();
    };

    IndiceMunicipal.prototype.temDados = function(ano) {

      return this.vereadores.temDados(ano) &&
             this.prefeitos.temDados(ano);
    };

    IndiceMunicipal.prototype.temEleito = function(ano, sigla) {

      return this.vereadores.temEleito(ano, sigla) ||
             this.prefeitos.temEleito(ano, sigla);
    };

    IndiceMunicipal.prototype.calculaIndice = function(ano, sigla) {

      return this.vereadores.calculaIndice(ano, sigla) * 0.75 +
             this.prefeitos.calculaIndice(ano, sigla) * 0.25;
    };

    return IndiceMunicipal;

  })();

  var IndiceNacional = (function() {

    _extends(IndiceNacional, Grafico);

    function IndiceNacional(federais, estaduais, municipais) {
      this.federais   = federais;
      this.estaduais  = estaduais;
      this.municipais = municipais;

      this.indiceFederal   = new IndiceFederal(federais);
      this.indiceEstadual  = new IndiceEstadual(estaduais);
      this.indiceMunicipal = new IndiceMunicipal(municipais);
    }

    IndiceNacional.prototype.anos = function() {
      return Lazy([ anos(this.federais), anos(this.estaduais), anos(this.municipais) ]).flatten().uniq();
    };

    IndiceNacional.prototype.siglas = function() {
      return Lazy([ this.indiceFederal.siglas(), this.indiceEstadual.siglas(), this.indiceMunicipal.siglas() ]).flatten().uniq();
    };

    IndiceNacional.prototype.temDados = function(ano) {

      return this.indiceFederal.temDados(ano) &&
             this.indiceEstadual.temDados(ano) &&
             this.indiceMunicipal.temDados(ano);
    };

    IndiceNacional.prototype.temEleito = function(ano, sigla) {

      return this.indiceFederal.temEleito(ano, sigla) ||
             this.indiceEstadual.temEleito(ano, sigla) ||
             this.indiceFederal.temEleito(ano, sigla);
    };

    IndiceNacional.prototype.calculaIndice = function(ano, sigla) {

      return this.indiceFederal.calculaIndice(ano, sigla) / 3 +
             this.indiceEstadual.calculaIndice(ano, sigla) / 3 +
             this.indiceMunicipal.calculaIndice(ano, sigla) / 3;
    };

    return IndiceNacional;

  })();

  window.Indice = (function() {

    function Indice(eleitos) {
      this.eleitos = eleitos;
    }

    Indice.prototype.deputadosFederais = function() {
      return new DeputadosFederais(this.eleitos.federais);
    };

    Indice.prototype.senadores = function() {
      return new Senadores(this.eleitos.federais);
    };

    Indice.prototype.congressoNacional = function() {
      return new CongressoNacional(this.eleitos.federais);
    };

    Indice.prototype.presidentes = function() {
      return new Presidentes(this.eleitos.federais);
    };

    Indice.prototype.indiceFederal = function() {
      return new IndiceFederal(this.eleitos.federais);
    };

    Indice.prototype.deputadosEstaduais = function() {
      return new DeputadosEstaduais(this.eleitos.estaduais);
    };

    Indice.prototype.governadores = function() {
      return new Governadores(this.eleitos.estaduais);
    };

    Indice.prototype.governadoresComPeso = function() {
      return new GovernadoresComPeso(this.eleitos.estaduais);
    };

    Indice.prototype.indiceEstadual = function() {
      return new IndiceEstadual(this.eleitos.estaduais);
    };

    Indice.prototype.vereadores = function() {
      return new Vereadores(this.eleitos.municipais);
    };

    Indice.prototype.prefeitos = function() {
      return new Prefeitos(this.eleitos.municipais);
    };

    Indice.prototype.prefeitosComPeso = function() {
      return new PrefeitosComPeso(this.eleitos.municipais);
    };

    Indice.prototype.indiceMunicipal = function() {
      return new IndiceMunicipal(this.eleitos.municipais);
    };

    Indice.prototype.indiceNacional = function() {
      return new IndiceNacional(this.eleitos.federais, this.eleitos.estaduais, this.eleitos.municipais);
    };

    return Indice;

  })();

})();
