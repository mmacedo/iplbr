'use strict';

describe('ipl.Cache', function() {

  describe('#has', function() {

    it('deve retornar false se estiver vazio', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      var resultado = cache.has(chave);
      expect(resultado).to.be.false();
    });

    it('deve retornar false se não tiver chave', function() {
      var chave = 'a', outra = 'b';
      var cache = new ipl.Cache();
      cache.set(outra, 1);
      var resultado = cache.has(chave);
      expect(resultado).to.be.false();
    });

    it('deve retornar true se tiver a chave', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      cache.set(chave, 1);
      var resultado = cache.has(chave);
      expect(resultado).to.be.true();
    });

  });

  describe('#get', function() {

    it('deve retornar undefined se a chave não existir', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      var resultado = cache.get(chave);
      expect(resultado).to.be.undefined();
    });

    it('deve retornar o valor se a chave existir', function() {
      var chave = 'a', valor = 1;
      var cache = new ipl.Cache();
      cache.set(chave, valor);
      var resultado = cache.get(chave);
      expect(resultado).to.equal(valor);
    });

  });

  describe('#set', function() {

    it('deve retornar o novo valor', function() {
      var chave = 'a', valor = 1, novo = 2;
      var cache = new ipl.Cache();
      cache.set(chave, valor);
      cache.set(chave, novo);
      var resultado = cache.get(chave);
      expect(resultado).to.equal(novo);
    });

  });

  describe('#delete', function() {

    it('deve remover chave', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      cache.set(chave, 1);
      cache.delete(chave);
      var resultado = cache.has(chave);
      expect(resultado).to.be.false();
    });

  });

  describe('#clear', function() {

    it('deve remover todas as chaves', function() {
      var chave1 = 'a', chave2 = 'b';
      var cache = new ipl.Cache();
      cache.set(chave1, 1);
      cache.set(chave2, 2);
      cache.clear();
      expect(cache.size).to.equal(0);
    });

  });

  describe('#size', function() {

    it('deve retornar 0 quando criado', function() {
      var cache = new ipl.Cache();
      expect(cache.size).to.equal(0);
    });

    it('deve retornar 1 quando adicionar 1 valor', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      cache.set(chave, 1);
      expect(cache.size).to.equal(1);
    });

    it('deve retornar 2 quando adicionar 2 valores', function() {
      var chave1 = 'a', chave2 = 'b';
      var cache = new ipl.Cache();
      cache.set(chave1, 1);
      cache.set(chave2, 2);
      expect(cache.size).to.equal(2);
    });

    it('não deve aumentar o tamanho quando sobrescrever um valor', function() {
      var chave = 'a';
      var cache = new ipl.Cache();
      cache.set(chave, 1);
      cache.set(chave, 2);
      expect(cache.size).to.equal(1);
    });

    it('deve diminuir quando remover um valor', function() {
      var chave1 = 'a', chave2 = 'b';
      var cache = new ipl.Cache();
      cache.set(chave1, 1);
      cache.set(chave2, 2);
      cache.delete(chave2);
      expect(cache.size).to.equal(1);
    });

    it('não deve diminuir se chamar delete duas vezes', function() {
      var chave1 = 'a', chave2 = 'b';
      var cache = new ipl.Cache();
      cache.set(chave1, 1);
      cache.set(chave2, 2);
      cache.delete(chave2);
      cache.delete(chave2);
      expect(cache.size).to.equal(1);
    });

  });

});
