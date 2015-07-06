/* global RepositorioEleitoral */

'use strict';

describe('RepositorioEleitoral', function() {

  // Esse método foi memoizado
  xdescribe('#anosDeEleicao', function() {

    it('deve retornar anos que teve eleição', function() {
      var json = { BR: { presidente: { 2002: {}, 2006: {} } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.anosDeEleicao('presidente', 'BR');
      expect(resultado).toEqual([ 2002, 2006 ]);
    });

    it('não deve retornar anos que não teve eleição para o cargo', function() {
      var json = { BR: { presidente: { 2002: {} }, senador: { 2006: {} } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.anosDeEleicao('presidente', 'BR');
      expect(resultado).toEqual([ 2002 ]);
    });

    it('deve retornar anos que teve eleição para um estado', function() {
      var json = { RS: { governador: { 2002: {}, 2006: {} } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.anosDeEleicao('governador', 'RS');
      expect(resultado).toEqual([ 2002, 2006 ]);
    });

  });

  // Esse método foi memoizado
  xdescribe('#mandatos', function() {

  });

  // Esse método foi memoizado
  xdescribe('#mandatosAtivos', function() {

  });

  xdescribe('#siglasComRepresentantes', function() {

    it('não deve retornar propriedades especiais como siglas', function() {
      var json = { BR: { senador: { 2002: { _total: 0, _mandato: 0 } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.siglasComRepresentantes('senador', 'BR', 2002);
      expect(resultado).toEqual([]);
    });

    it('deve retornar siglas para a eleição', function() {
      var json = { BR: { senador: { 2002: { a1: {}, a2: {} } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.siglasComRepresentantes('senador', 'BR', 2002);
      expect(resultado).toEqual([ 'a1', 'a2' ]);
    });

    it('deve retornar siglas para as eleições municipais em um estado', function() {
      var json = { RS: { vereador: { 2002: { a1: {}, a2: {} } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.siglasComRepresentantes('vereador', 'RS', 2002);
      expect(resultado).toEqual([ 'a1', 'a2' ]);
    });

  });

  describe('#quantidade', function() {

    it('deve retornar quantidade de representantes da sigla', function() {
      var json = { BR: { senador: { 2002: { a1: 3 } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.quantidade('senador', 'BR', 2002, 'a1');
      expect(resultado).toEqual(3);
    });

    it('deve retornar zero se não tiver representantes', function() {
      var json = { BR: { senador: { 2002: {} } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.quantidade('senador', 'BR', 2002, 'a1');
      expect(resultado).toEqual(0);
    });

    it('deve retornar zero se não tiver eleição no ano', function() {
      var json = { BR: { senador: {} } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.quantidade('senador', 'BR', 2002, null);
      expect(resultado).toEqual(0);
    });

    it('deve retornar quantidade de representantes municipais da uf', function() {
      var json = { RS: { vereador: { 2000: { a1: { quantidade: 120 } } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.quantidade('vereador', 'RS', 2000, 'a1');
      expect(resultado).toEqual(120);
    });

  });

  describe('#proporcionalAPopulacao', function() {

    it('deve retornar representantes municipais proporcional à população', function() {
      var json = { RS: { vereador: { 2000: { a1: { populacao: 120 } } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.proporcionalAPopulacao('vereador', 'RS', 2000, 'a1');
      expect(resultado).toEqual(120);
    });

    it('deve retornar zero se não tiver representantes', function() {
      var json = { RS: { vereador: { 2000: {} } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.proporcionalAPopulacao('vereador', 'RS', 2000, 'a1');
      expect(resultado).toEqual(0);
    });

    it('deve retornar zero se não tiver eleição no ano', function() {
      var json = { RS: { vereador: {} } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.proporcionalAPopulacao('vereador', 'RS', 2000, null);
      expect(resultado).toEqual(0);
    });

  });

  describe('#total', function() {

    it('deve retornar quantidade total de representantes', function() {
      var json = { BR: { senador: { 2002: { _total: 10 } } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.total('senador', null, 2002);
      expect(resultado).toEqual(10);
    });

  });

  describe('#populacao', function() {

    it('deve retornar a população do país', function() {
      var json = { BR: { populacao: { 2002: 50 } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.populacao('BR', 2002);
      expect(resultado).toEqual(50);
    });

    it('deve retornar a população para uma uf', function() {
      var json = { RS: { populacao: { 2002: 10 } } };
      var repo = new RepositorioEleitoral(json);
      var resultado = repo.populacao('RS', 2002);
      expect(resultado).toEqual(10);
    });

  });

});
