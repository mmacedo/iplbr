'use strict';

describe('ipl.RepositorioEleitoral', function() {

  describe('#anosDeEleicao', function() {

    it('deve retornar anos que teve eleição', function() {
      var json = { BR: { presidente: { 2002: {}, 2006: {} } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.anosDeEleicao(tipoDeEleicao);
      expect(resultado).to.eql([ 2002, 2006 ]);
    });

    it('não deve retornar anos que não teve eleição para o cargo', function() {
      var json = { BR: { presidente: { 2002: {} }, senador: { 2006: {} } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.anosDeEleicao(tipoDeEleicao);
      expect(resultado).to.eql([ 2002 ]);
    });

    it('deve retornar anos que teve eleição para um estado', function() {
      var json = { RS: { governador: { 2002: {}, 2006: {} } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'governador', ue: 'RS' };
      var resultado = repo.anosDeEleicao(tipoDeEleicao);
      expect(resultado).to.eql([ 2002, 2006 ]);
    });

    it('deve retornar vazio se não teve eleição', function() {
      var json = { BR: { presidente: {} } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.anosDeEleicao(tipoDeEleicao);
      expect(resultado).to.eql([]);
    });

  });

  describe('#mandatosAtivos', function() {

    it('deve retornar mandato que acaba no ano', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.mandatosAtivos(tipoDeEleicao, 1994);
      expect(resultado).to.eql([ 1989 ]);
    });

    it('deve retornar mandato que não terminaram no ano', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.mandatosAtivos(tipoDeEleicao, 1990);
      expect(resultado).to.eql([ 1989 ]);
    });

    it('não deve retornar mandato que não iniciou', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.mandatosAtivos(tipoDeEleicao, 1989);
      expect(resultado).to.eql([]);
    });

    it('não deve retornar mandato que já encerrou', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'presidente', ue: 'BR' };
      var resultado = repo.mandatosAtivos(tipoDeEleicao, 1995);
      expect(resultado).to.eql([]);
    });

  });

  describe('#partidosComRepresentantes', function() {

    it('deve retornar siglas para a eleição', function() {
      var json = { BR: { senador: { 2002: { por_sigla: { a1: {}, a2: {} } } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.partidosComRepresentantes(tipoDeEleicao, 2002);
      expect(resultado).to.eql([ 'a1', 'a2' ]);
    });

    it('deve retornar siglas para as eleições municipais em um estado', function() {
      var json = { RS: { vereador: { 2002: { por_sigla: { a1: {}, a2: {} } } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      var resultado = repo.partidosComRepresentantes(tipoDeEleicao, 2002);
      expect(resultado).to.eql([ 'a1', 'a2' ]);
    });

    it('deve retornar vazio se não ter nenhum partido', function() {
      var json = { BR: { senador: { 2002: { total: 0, mandato: 0 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.partidosComRepresentantes(tipoDeEleicao, 2002);
      expect(resultado).to.eql([]);
    });

    it('deve retornar vazio se não ter eleição no ano', function() {
      var json = { BR: { senador: {} } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.partidosComRepresentantes(tipoDeEleicao, 2002);
      expect(resultado).to.eql([]);
    });

  });

  describe('#quantidade', function() {

    it('deve retornar quantidade de representantes da sigla', function() {
      var json = { BR: { senador: { 2002: { por_sigla: { a1: 3 } } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.quantidade(tipoDeEleicao, 2002, 'a1');
      expect(resultado).to.equal(3);
    });

    it('deve retornar quantidade de representantes municipais da uf', function() {
      var json = { RS: { vereador: { 2000: { por_sigla: { a1: { quantidade: 120 } } } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      var resultado = repo.quantidade(tipoDeEleicao, 2000, 'a1');
      expect(resultado).to.equal(120);
    });

    it('deve retornar zero se o partido não ter representante no ano', function() {
      var json = { BR: { senador: { 2002: {} } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.quantidade(tipoDeEleicao, 2002, 'a1');
      expect(resultado).to.equal(0);
    });

    it('deve retornar zero se não ter eleição no ano', function() {
      var json = { BR: { senador: {} } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.quantidade(tipoDeEleicao, 2002, null);
      expect(resultado).to.equal(0);
    });

  });

  describe('#proporcionalAPopulacao', function() {

    it('deve retornar representantes municipais proporcional à população', function() {
      var json = { RS: { vereador: { 2000: { por_sigla: { a1: { populacao: 120 } } } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      var resultado = repo.proporcionalAPopulacao(tipoDeEleicao, 2000, 'a1');
      expect(resultado).to.equal(120);
    });

    it('deve retornar zero se não tiver representantes', function() {
      var json = { RS: { vereador: { 2000: {} } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      var resultado = repo.proporcionalAPopulacao(tipoDeEleicao, 2000, 'a1');
      expect(resultado).to.equal(0);
    });

    it('deve retornar zero se não tiver eleição no ano', function() {
      var json = { RS: { vereador: {} } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'vereador', ue: 'RS' };
      var resultado = repo.proporcionalAPopulacao(tipoDeEleicao, 2000, null);
      expect(resultado).to.equal(0);
    });

  });

  describe('#total', function() {

    it('deve retornar quantidade total de representantes', function() {
      var json = { BR: { senador: { 2002: { total: 10 } } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var tipoDeEleicao = { cargo: 'senador', ue: 'BR' };
      var resultado = repo.total(tipoDeEleicao, 2002);
      expect(resultado).to.equal(10);
    });

  });

  describe('#populacao', function() {

    it('deve retornar a população do país', function() {
      var json = { BR: { populacao: { 2002: 50 } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var resultado = repo.populacao('BR', 2002);
      expect(resultado).to.equal(50);
    });

    it('deve retornar a população para uma uf', function() {
      var json = { RS: { populacao: { 2002: 10 } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var resultado = repo.populacao('RS', 2002);
      expect(resultado).to.equal(10);
    });

    it('deve gerar exceção se não ter estimativa para o ano', function() {
      var json = { RS: { populacao: {} } };
      var repo = new ipl.RepositorioEleitoral(json);
      function chamada() { repo.populacao('RS', 2002); }
      expect(chamada).to.throw();
    });

  });

});
