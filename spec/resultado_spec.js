'use strict';

describe('ipl.ResultadoSemPeso', function() {

  describe('#quantidade', function() {

    beforeEach(function() {
      this.deputadosFederais = {
        2010: { mandato: 4, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 4, por_sigla: { a1: 1, a2: 1 } }
      };
      this.senadores = {
        2010: { mandato: 8, por_sigla: { a1: 1, a2: 1 } },
        2014: { mandato: 8, por_sigla: { a1: 1, a2: 1 } }
      };
    });

    it('deve jogar exceção se não receber partido', function() {
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral({}));
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      function chamada() { x.quantidade(tipoDeEleicao, 2014, null); }
      expect(chamada).to.throw();
    });

    it('deve retornar o número de eleitos', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a1')).to.equal(1);
    });

    it('deve retornar zero se não o partido não elegeu ninguém', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a3')).to.equal(0);
    });

    it('deve retornar o número de eleitos na última eleição', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2015, 'a1')).to.equal(1);
      expect(x.quantidade(tipoDeEleicao, 2016, 'a1')).to.equal(1);
      expect(x.quantidade(tipoDeEleicao, 2017, 'a1')).to.equal(1);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2009, 'a1')).to.equal(0);
      expect(x.quantidade(tipoDeEleicao, 2018, 'a1')).to.equal(0);
    });

    it('deve retornar o número de eleitos de todos mandatos ativos', function() {
      var json = { BR: { senador: this.senadores } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a1')).to.equal(2);
    });

    it('deve retornar o número de eleitos de mandatos de tamanho não usual', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5, por_sigla: { a1: 1 } } } } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 1989, 'a1')).to.equal(1);
      expect(x.quantidade(tipoDeEleicao, 1993, 'a1')).to.equal(1);
    });

  });

  describe('#total', function() {

    beforeEach(function() {
      this.deputadosFederais = {
        2010: { mandato: 4, total: 5 },
        2014: { mandato: 4, total: 2 }
      };
      this.senadores = {
        2010: { mandato: 8, total: 2 },
        2014: { mandato: 8, total: 2 }
      };
    });

    it('deve retornar o total de eleitos', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.total(tipoDeEleicao, 2014)).to.equal(2);
    });

    it('deve retornar o total de eleitos na última eleição', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.total(tipoDeEleicao, 2015)).to.equal(2);
      expect(x.total(tipoDeEleicao, 2016)).to.equal(2);
      expect(x.total(tipoDeEleicao, 2017)).to.equal(2);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.total(tipoDeEleicao, 2009)).to.equal(0);
      expect(x.total(tipoDeEleicao, 2018)).to.equal(0);
    });

    it('deve retornar o total de eleitos de todos mandatos ativos', function() {
      var json = { BR: { senador: this.senadores } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      expect(x.total(tipoDeEleicao, 2014)).to.equal(4);
    });

  });

  describe('#peso', function() {

    beforeEach(function() {
      this.deputadosFederais = {
        2014: { mandato: 4, total: 2 }
      };
      this.senadores = {
        2010: { mandato: 8, total: 2 },
        2014: { mandato: 8, total: 2 }
      };
    });

    it('deve retornar o peso igual ao total de eleitos (= sem peso)', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.peso(tipoDeEleicao, 2014)).to.equal(x.total(tipoDeEleicao, 2014));
    });

    it('deve retornar zero se o total de eleitos é zero', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.peso(tipoDeEleicao, 2013)).to.equal(0);
    });

    it('deve retornar o peso igual ao total de todos os mandatos ativos', function() {
      var json = { BR: { senador: this.senadores } };
      var x = new ipl.ResultadoSemPeso(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      expect(x.peso(tipoDeEleicao, 2014)).to.equal(x.total(tipoDeEleicao, 2014));
    });

  });

});

describe('ipl.ResultadoPorPopulacao', function() {

  describe('#quantidade', function() {

    beforeEach(function() {
      this.populacao = {
        2009:   42,
        2010:  600, 2011:  700, 2012:  800, 2013:  900,
        2014: 1000, 2015: 1100, 2016: 1200, 2017: 1300,
        2018:   42
      };
      this.presidente = { 2014: { total: 1, por_sigla: { a1: 1 } } };
      this.deputadosFederais = {
        2010: { mandato: 4, total: 6, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 4, total: 2, por_sigla: { a1: 1, a2: 1 } }
      };
      this.senadores = {
        2010: { mandato: 8, total: 6, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 8, total: 2, por_sigla: { a1: 1, a2: 1 } }
      };
    });

    it('deve jogar exceção se não receber partido', function() {
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral({}));
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      function chamada() { x.quantidade(tipoDeEleicao, 2014, null); }
      expect(chamada).to.throw();
    });

    it('deve retornar a população da UE se todos eleitos são do partido', function() {
      var json = { BR: { populacao: this.populacao, presidente: this.presidente } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a1')).to.equal(1000);
    });

    it('deve retornar metade da população da UE se tem metade dos eleitos', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a1')).to.equal(this.populacao[2014] / 2);
    });

    it('deve retornar a soma pré-calculada da UF para os municípios', function() {
      var json = { RS: {
        populacao: { 2012: 1000 },
        vereador:  { 2012: { por_sigla: { a1: { populacao: 500 } } } }
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      expect(x.quantidade(tipoDeEleicao, 2012, 'a1')).to.equal(500);
    });

    it('deve retornar zero se não o partido não elegeu ninguém', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a3')).to.equal(0);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2009)).to.equal(0);
      expect(x.quantidade(tipoDeEleicao, 2018)).to.equal(0);
    });

    it('deve retornar última eleição proporcional ao ano do índice', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'deputado_federal', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2015, 'a1')).to.equal(this.populacao[2015] / 2);
      expect(x.quantidade(tipoDeEleicao, 2016, 'a1')).to.equal(this.populacao[2016] / 2);
      expect(x.quantidade(tipoDeEleicao, 2017, 'a1')).to.equal(this.populacao[2017] / 2);
    });

    it('deve retornar todos mandatos ativos proporcional ao ano do índice', function() {
      var json = { BR: { populacao: this.populacao, senador: this.senadores } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 2014, 'a1')).to.equal(this.populacao[2014] / 2);
    });

    it('deve retornar o número de eleitos de mandatos de tamanho não usual', function() {
      var json = { BR: {
        populacao:  { 1989: 500, 1993: 1000 },
        presidente: { 1989: { mandato: 5, total: 1, por_sigla: { a1: 1 } } }
      } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      expect(x.quantidade(tipoDeEleicao, 1989, 'a1')).to.equal(json.BR.populacao[1989]);
      expect(x.quantidade(tipoDeEleicao, 1993, 'a1')).to.equal(json.BR.populacao[1993]);
    });

  });

  describe('#total', function() {

    it('deve retornar a população da UE', function() {
      var json = { BR: { populacao: { 2014: 1000 } } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: null, ue: 'BR' };
      expect(x.total(tipoDeEleicao, 2014)).to.equal(json.BR.populacao[2014]);
    });

  });

  describe('#peso', function() {

    it('deve retornar a população da UE', function() {
      var json = { BR: { populacao: { 2014: 1000 } } };
      var x = new ipl.ResultadoPorPopulacao(new ipl.RepositorioEleitoral(json));
      var tipoDeEleicao = { cargo: null, ue: 'BR' };
      expect(x.peso(tipoDeEleicao, 2014)).to.equal(json.BR.populacao[2014]);
    });

  });

});
