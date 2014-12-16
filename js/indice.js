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
          return _this.temEleito(ano, sigla);
        });

        // Tamanho da bancada em relação ao total da casa
        var percentualBancadaPorAno = anosComBancada.map(function(ano) {
          return [ parseInt(ano, 10), _this.calculaIndice(ano, sigla) ];
        });

        return {
          name: sigla,
          data: percentualBancadaPorAno.toArray()
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

    MandatoQuatroAnos.prototype.total = function(ano) { return 0; };
    MandatoQuatroAnos.prototype.valorPorSigla = function(ano, sigla) { return 0; };

    MandatoQuatroAnos.prototype.temEleito = function(ano, sigla) {
      return this.valorPorSigla(ano, sigla) > 0;
    };

    MandatoQuatroAnos.prototype.calculaIndice = function(ano, sigla) {

      var eleitos = this.valorPorSigla(ano, sigla);
      var total   = this.total(ano);

      return eleitos / total * 100;
    };

    return MandatoQuatroAnos;

  })();

  var MandatoOitoAnos = (function() {

    _extends(MandatoOitoAnos, Grafico);

    function MandatoOitoAnos(eleicoes) {
      this.eleicoes = eleicoes;
    }

    MandatoOitoAnos.prototype.total = function(ano) { return 0; };
    MandatoOitoAnos.prototype.valorPorSigla = function(ano, sigla) { return 0; };

    MandatoOitoAnos.prototype.temEleito = function(ano, sigla) {

      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();

      // Só os anos que tenha todos
      if (this.total(quatroAnosAntes) == 0) {
        return false;
      }

      return this.valorPorSigla(quatroAnosAntes, sigla) > 0 ||
             this.valorPorSigla(ano, sigla) > 0;
    };

    MandatoOitoAnos.prototype.calculaIndice = function(ano, sigla) {

      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();

      var eleitos = this.valorPorSigla(quatroAnosAntes, sigla) + this.valorPorSigla(ano, sigla);
      var total   = this.total(quatroAnosAntes) + this.total(ano);

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

    DeputadosFederais.prototype.total = function(ano) {
      return this.eleicoes[ano].total_deputados_federais;
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

    Senadores.prototype.total = function(ano) {
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

    CongressoNacional.prototype.temEleito = function(ano, sigla) {

      var quatroAnosAntes = (parseInt(ano, 10) - 4).toString();

      // Só os anos que tenha todos os senadores
      if (this.senadores.total(quatroAnosAntes) == 0) {
        return false;
      }

      return this.deputadosFederais.valorPorSigla(ano, sigla) > 0 ||
             this.senadores.valorPorSigla(ano, sigla) > 0;
    };

    CongressoNacional.prototype.calculaIndice = function(ano, sigla) {

      return this.deputadosFederais.calculaIndice(ano, sigla) * 0.5 +
             this.senadores.calculaIndice(ano, sigla) * 0.5;
    };

    return CongressoNacional;

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

    DeputadosEstaduais.prototype.total = function(ano) {
      return this.eleicoes[ano].total_deputados_estaduais;
    };

    DeputadosEstaduais.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].deputados_estaduais_por_sigla[sigla] || 0;
    };

    return DeputadosEstaduais;

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

    Vereadores.prototype.total = function(ano) {
      return this.eleicoes[ano].total_vereadores;
    };

    Vereadores.prototype.valorPorSigla = function(ano, sigla) {
      return this.eleicoes[ano].vereadores_por_sigla[sigla] || 0;
    };

    return Vereadores;

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

    Indice.prototype.deputadosEstaduais = function() {
      return new DeputadosEstaduais(this.eleitos.estaduais);
    };

    Indice.prototype.vereadores = function() {
      return new Vereadores(this.eleitos.municipais);
    };

    return Indice;

  })();

})();
