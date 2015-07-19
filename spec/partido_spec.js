'use strict';

describe('ipl.RepositorioDePartidos', function() {

  describe('#buscarSucessor', function() {

    it('deve retornar sucessor se foi incorporado', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado após a incorporação', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_apos  = { sigla: 'B', numero: 21, fundado: 2014 };
      var b_antes = { sigla: 'B', numero: 22, fundado: 1979 };
      var repo = new ipl.RepositorioDePartidos([ a, b_apos, b_antes ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b_antes);
    });

    it('deve retornar sucessor se foi renomeado', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado antes da mudança de nome', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

    it('deve retornar sucessor se foi fundido', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado antes da fusão', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

    it('não deve retornar partido extinto antes do predecessor', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979, extinto: 2010 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 1979, extinto: 2014 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscarSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

  });

});
