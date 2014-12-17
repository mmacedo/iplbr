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

  var Grafico = (function() {

    function Grafico() {}

    Grafico.prototype.anos = function() { return Lazy([]); };
    Grafico.prototype.siglas = function() { return Lazy([]); };
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

    function MandatoQuatroAnos() {}

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

    function MandatoOitoAnos() {}

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
      this.eleicoes = eleicoes;
    }

    DeputadosFederais.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    DeputadosFederais.prototype.siglas = function() {
      return this.eleicoes.siglasDeputadosFederais();
    };

    DeputadosFederais.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalDeputadosFederais(ano);
    };

    DeputadosFederais.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.deputadosFederais(ano, sigla);
    };

    return DeputadosFederais;

  })();

  var Senadores = (function() {

    _extends(Senadores, MandatoOitoAnos);

    function Senadores(eleicoes) {
      this.eleicoes = eleicoes;
    }

    Senadores.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    Senadores.prototype.siglas = function() {
      return this.eleicoes.siglasSenadores();
    };

    Senadores.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalSenadores(ano);
    };

    Senadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.senadores(ano, sigla);
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
      return this.eleicoes.anos();
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
      this.eleicoes = eleicoes;
    }

    Presidentes.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    Presidentes.prototype.siglas = function() {
      return this.eleicoes.siglasPresidentes();
    };

    Presidentes.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalPresidentes(ano);
    };

    Presidentes.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.presidentes(ano, sigla);
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
      return this.eleicoes.anos();
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
      this.eleicoes = eleicoes;
    }

    DeputadosEstaduais.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    DeputadosEstaduais.prototype.siglas = function() {
      return this.eleicoes.siglasDeputadosEstaduais();
    };

    DeputadosEstaduais.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalDeputadosEstaduais(ano);
    };

    DeputadosEstaduais.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.deputadosEstaduais(ano, sigla);
    };

    return DeputadosEstaduais;

  })();

  var Governadores = (function() {

    _extends(Governadores, MandatoQuatroAnos);

    function Governadores(eleicoes) {
      this.eleicoes = eleicoes;
    }

    Governadores.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    Governadores.prototype.siglas = function() {
      return this.eleicoes.siglasGovernadores();
    };

    Governadores.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalGovernadores(ano);
    };

    Governadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.governadores(ano, sigla);
    };

    return Governadores;

  })();

  var GovernadoresComPeso = (function() {

    _extends(GovernadoresComPeso, MandatoQuatroAnos);

    function GovernadoresComPeso(eleicoes) {
      this.eleicoes = eleicoes;
    }

    GovernadoresComPeso.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    GovernadoresComPeso.prototype.siglas = function() {
      return this.eleicoes.siglasGovernadores();
    };

    GovernadoresComPeso.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalDeputadosEstaduais(ano);
    };

    GovernadoresComPeso.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.pesosDosGovernadores(ano, sigla);
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
      return this.eleicoes.anos();
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
      this.eleicoes = eleicoes;
    }

    Vereadores.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    Vereadores.prototype.siglas = function() {
      return this.eleicoes.siglasVereadores();
    };

    Vereadores.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalVereadores(ano);
    };

    Vereadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.vereadores(ano, sigla);
    };

    return Vereadores;

  })();

  var Prefeitos = (function() {

    _extends(Prefeitos, MandatoQuatroAnos);

    function Prefeitos(eleicoes) {
      this.eleicoes = eleicoes;
    }

    Prefeitos.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    Prefeitos.prototype.siglas = function() {
      return this.eleicoes.siglasPrefeitos();
    };

    Prefeitos.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalPrefeitos(ano);
    };

    Prefeitos.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.prefeitos(ano, sigla);
    };

    return Prefeitos;

  })();

  var PrefeitosComPeso = (function() {

    _extends(PrefeitosComPeso, MandatoQuatroAnos);

    function PrefeitosComPeso(eleicoes) {
      this.eleicoes = eleicoes;
    }

    PrefeitosComPeso.prototype.anos = function() {
      return this.eleicoes.anos();
    };

    PrefeitosComPeso.prototype.siglas = function() {
      return this.eleicoes.siglasPrefeitos();
    };

    PrefeitosComPeso.prototype.valorTotal = function(ano) {
      return this.eleicoes.totalVereadores(ano);
    };

    PrefeitosComPeso.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes.pesosDosPrefeitos(ano, sigla);
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
      return this.eleicoes.anos();
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
      return Lazy([ this.federais.anos(), this.estaduais.anos(), this.municipais.anos() ]).flatten().uniq();
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

      return this.obter('anos', function() {
        return Lazy(_this.json).keys();
      });
    };

    Eleicoes.prototype.siglas = function(cargo) {

      var _this = this;

      return this.obter(cargo, function () {
        return _this.anos().map(function(ano) {
          return Lazy(_this.json[ano][cargo + "_por_sigla"]).keys();
        }).flatten().uniq();
      });
    };

    Eleicoes.prototype.dadosPorSigla = function(nome, ano) {

      if (!(ano in this.json)) {
        return {};
      }

      var _this = this;
      return this.obter(nome + ano, function() {
        return _this.json[ano][nome + '_por_sigla'];
      });
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
      return ano in this.json ? this.json[ano].total_deputados_federais : 0;
    };

    EleicoesFederais.prototype.totalSenadores = function(ano) {
      return ano in this.json ? this.json[ano].total_senadores : 0;
    };

    EleicoesFederais.prototype.totalPresidentes = function(ano) {
      return ano in this.json ? this.json[ano].total_presidentes : 0;
    };

    EleicoesFederais.prototype.deputadosFederais = function(ano, sigla) {
      return this.dadosPorSigla('deputados_federais', ano)[sigla] || 0;
    };

    EleicoesFederais.prototype.senadores = function(ano, sigla) {
      return this.dadosPorSigla('senadores', ano)[sigla] || 0;
    };

    EleicoesFederais.prototype.presidentes = function(ano, sigla) {
      return this.dadosPorSigla('presidentes', ano)[sigla] || 0;
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

    EleicoesEstaduais.prototype.totalDeputadosEstaduais = function(ano) {
      return ano in this.json ? this.json[ano].total_deputados_estaduais : 0;
    };

    EleicoesEstaduais.prototype.totalGovernadores = function(ano) {
      return ano in this.json ? this.json[ano].total_governadores : 0;
    };

    EleicoesEstaduais.prototype.deputadosEstaduais = function(ano, sigla) {
      return this.dadosPorSigla('deputados_estaduais', ano)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.governadores = function(ano, sigla) {
      return this.dadosPorSigla('governadores', ano)[sigla] || 0;
    };

    EleicoesEstaduais.prototype.pesosDosGovernadores = function(ano, sigla) {
      return this.dadosPorSigla('peso_dos_governadores', ano)[sigla] || 0;
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

    EleicoesMunicipais.prototype.totalVereadores = function(ano) {
      return ano in this.json ? this.json[ano].total_vereadores : 0;
    };

    EleicoesMunicipais.prototype.totalPrefeitos = function(ano) {
      return ano in this.json ? this.json[ano].total_prefeitos : 0;
    };

    EleicoesMunicipais.prototype.vereadores = function(ano, sigla) {
      return this.dadosPorSigla('vereadores', ano)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.prefeitos = function(ano, sigla) {
      return this.dadosPorSigla('prefeitos', ano)[sigla] || 0;
    };

    EleicoesMunicipais.prototype.pesosDosPrefeitos = function(ano, sigla) {
      return this.dadosPorSigla('peso_dos_prefeitos', ano)[sigla] || 0;
    };

    return EleicoesMunicipais;

  })();

  window.Indice = (function() {

    function Indice(eleitos) {
      this.eleitos = eleitos;

      this.federais   = new EleicoesFederais(this.eleitos.federais);
      this.estaduais  = new EleicoesEstaduais(this.eleitos.estaduais);
      this.municipais = new EleicoesMunicipais(this.eleitos.municipais);
    }

    Indice.prototype.deputadosFederais = function() {
      return new DeputadosFederais(this.federais);
    };

    Indice.prototype.senadores = function() {
      return new Senadores(this.federais);
    };

    Indice.prototype.congressoNacional = function() {
      return new CongressoNacional(this.federais);
    };

    Indice.prototype.presidentes = function() {
      return new Presidentes(this.federais);
    };

    Indice.prototype.indiceFederal = function() {
      return new IndiceFederal(this.federais);
    };

    Indice.prototype.deputadosEstaduais = function() {
      return new DeputadosEstaduais(this.estaduais);
    };

    Indice.prototype.governadores = function() {
      return new Governadores(this.estaduais);
    };

    Indice.prototype.governadoresComPeso = function() {
      return new GovernadoresComPeso(this.estaduais);
    };

    Indice.prototype.indiceEstadual = function() {
      return new IndiceEstadual(this.estaduais);
    };

    Indice.prototype.vereadores = function() {
      return new Vereadores(this.municipais);
    };

    Indice.prototype.prefeitos = function() {
      return new Prefeitos(this.municipais);
    };

    Indice.prototype.prefeitosComPeso = function() {
      return new PrefeitosComPeso(this.municipais);
    };

    Indice.prototype.indiceMunicipal = function() {
      return new IndiceMunicipal(this.municipais);
    };

    Indice.prototype.indiceNacional = function() {
      return new IndiceNacional(this.federais, this.estaduais, this.municipais);
    };

    return Indice;

  })();

})();
