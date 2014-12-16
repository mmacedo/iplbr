;(function() {

  // Para função map, converte todos os itens para inteiros
  var toInt = function(s) {
    return parseInt(s, 10);
  };

  Indice = (function() {
    function Indice(eleitos) {
      this.eleitos = eleitos;
    }

    // Retorna uma lista de anos que ocorreu eleições
    Indice.prototype.anos = function(esfera) {
      return Lazy(this.eleitos[esfera]).keys();
    };

    // Retorna todas as siglas que já elegeram determinado cargo
    Indice.prototype.siglas = function(esfera, cargo) {
      var _this = this;
      return this.anos(esfera).map(function(ano) {
        return Lazy(_this.eleitos[esfera][ano]["" + cargo + "_por_sigla"]).keys();
      }).flatten().uniq();
    };

    Indice.prototype.anos_federais = function() {
      return this.anos('federais').map(toInt).toArray();
    };

    Indice.prototype.anos_estaduais = function() {
      return this.anos('estaduais').map(toInt).toArray();
    };

    Indice.prototype.anos_municipais = function() {
      return this.anos('municipais').map(toInt).toArray();
    };

    Indice.prototype.deputados_federais = function() {

      var _this = this;
      var anos = this.anos('federais');
      var siglas = this.siglas('federais', 'deputados_federais');

      return siglas.map(function(sigla) {

        // Anos que a sigla elegeu deputado federal
        var anos_com_deputado = anos.filter(function(ano) {
          return sigla in _this.eleitos.federais[ano].deputados_federais_por_sigla;
        });

        // Tamanho da bancada em relação ao total de deputados
        var percentual_deputados = anos_com_deputado.map(function(ano) {

          var bancada = _this.eleitos.federais[ano].deputados_federais_por_sigla[sigla];
          var total   = _this.eleitos.federais[ano].total_deputados_federais;

          return [ parseInt(ano, 10), bancada / total * 100 ];
        });

        // Ex.: { name: 'PT', data: [ [ 1998, 8.901 ], [ 2002, 13.02 ] ] }
        return {
          name: sigla,
          data: percentual_deputados.toArray()
        };
      }).toArray();
    };

    Indice.prototype.senadores = function() {

      var _this = this;
      var anos = this.anos('federais');
      var siglas = this.siglas('federais', 'senadores');

      return siglas.map(function(sigla) {

        // Anos que a sigla elegeu senador (ou continuou tendo)
        var anos_com_senador = anos.filter(function(ano) {

          var quatro_anos_antes = parseInt(ano - 4, 10).toString();

          // Só os anos que eu tenho todos os senadores
          if (!(quatro_anos_antes in _this.eleitos.federais)) {
            return false;
          }

          return sigla in _this.eleitos.federais[quatro_anos_antes].senadores_por_sigla ||
                 sigla in _this.eleitos.federais[ano].senadores_por_sigla;
        });

        // Tamanho da bancada em relação ao total de senadores
        var percentual_senadores = anos_com_senador.map(function(ano) {

          var quatro_anos_antes = parseInt(ano - 4, 10).toString();

          var bancada = (_this.eleitos.federais[quatro_anos_antes].senadores_por_sigla[sigla] || 0) +
                        (_this.eleitos.federais[ano].senadores_por_sigla[sigla] || 0);
          var total   = _this.eleitos.federais[quatro_anos_antes].total_senadores +
                        _this.eleitos.federais[ano].total_senadores;

          return [ parseInt(ano, 10), bancada / total * 100 ];
        });

        // Ex.: { name: 'PT', data: [ [ 1998, 8.901 ], [ 2002, 13.02 ] ] }
        return {
          name: sigla,
          data: percentual_senadores.toArray()
        };
      }).toArray();
    };

    Indice.prototype.deputados_estaduais = function() {

      var _this = this;
      var anos = this.anos('estaduais');
      var siglas = this.siglas('estaduais', 'deputados_estaduais');

      return siglas.map(function(sigla) {

        // Anos que a sigla elegeu deputado estadual
        var anos_com_deputado = anos.filter(function(ano) {
          return sigla in _this.eleitos.estaduais[ano].deputados_estaduais_por_sigla;
        });

        // Tamanho da bancada em relação ao total de deputados
        var percentual_deputados = anos_com_deputado.map(function(ano) {

          var bancada = _this.eleitos.estaduais[ano].deputados_estaduais_por_sigla[sigla];
          var total   = _this.eleitos.estaduais[ano].total_deputados_estaduais;

          return [ parseInt(ano, 10), bancada / total * 100 ];
        });

        // Ex.: { name: 'PT', data: [ [ 1998, 8.901 ], [ 2002, 13.02 ] ] }
        return {
          name: sigla,
          data: percentual_deputados.toArray()
        };
      }).toArray();
    };

    Indice.prototype.vereadores = function() {

      var _this = this;
      var anos = this.anos('municipais');
      var siglas = this.siglas('municipais', 'vereadores');

      return siglas.map(function(sigla) {

        // Anos que a sigla elegeu deputado estadual
        var anos_com_deputado = anos.filter(function(ano) {
          return sigla in _this.eleitos.municipais[ano].vereadores_por_sigla;
        });

        // Tamanho da bancada em relação ao total de vereadores
        var percentual_vereadores = anos_com_deputado.map(function(ano) {

          var bancada = _this.eleitos.municipais[ano].vereadores_por_sigla[sigla];
          var total   = _this.eleitos.municipais[ano].total_vereadores;

          return [ parseInt(ano, 10), bancada / total * 100 ];
        });

        // Ex.: { name: 'PT', data: [ [ 1998, 8.901 ], [ 2002, 13.02 ] ] }
        return {
          name: sigla,
          data: percentual_vereadores.toArray()
        };
      }).toArray();
    };

    return Indice;

  })();

})();
