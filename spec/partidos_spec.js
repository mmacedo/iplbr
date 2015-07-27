'use strict';

describe('ipl.RepositorioDePartidos', function() {

  describe('#constructor', function() {

    it('deve usar .PARTIDOS como padrão se não receber partidos', function() {
      var repo = new ipl.RepositorioDePartidos();
      expect(repo.partidos).to.equal(ipl.RepositorioDePartidos.PARTIDOS);
    });

  });

  describe('#todos', function() {

    it('dever retornar todos os partidos', function() {
      var partidos = [
        { sigla: 'A', numero: 1, fundado: 1979 },
        { sigla: 'B', numero: 2, fundado: 1979 }
      ];
      var repo = new ipl.RepositorioDePartidos(partidos);
      expect(repo.todos()).to.eql(partidos);
    });

  });

  describe('#busca', function() {

    var a =  { sigla: 'A', numero: 1, fundado: 1979 };
    var b1 = { sigla: 'B', numero: 2, fundado: 1979 };
    var b2 = { sigla: 'B', numero: 3, fundado: 1980 };

    it('dever retornar partido', function() {
      var repo = new ipl.RepositorioDePartidos([ a, b1, b2 ]);
      var filtro = { sigla: b2.sigla, numero: b2.numero };
      var resultado = repo.busca(filtro);
      expect(resultado).to.eql(b2);
    });

    it('dever jogar exceção se não encontrar partido', function() {
      var repo = new ipl.RepositorioDePartidos([ a, b1 ]);
      var filtro = { sigla: b2.sigla, numero: b2.numero };
      function chamada() { repo.busca(filtro); }
      expect(chamada).to.throw();
    });

  });

  describe('#buscaSucessor', function() {

    it('deve retornar sucessor se foi incorporado', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado após a incorporação', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_apos  = { sigla: 'B', numero: 21, fundado: 2014 };
      var b_antes = { sigla: 'B', numero: 22, fundado: 1979 };
      var repo = new ipl.RepositorioDePartidos([ a, b_apos, b_antes ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b_antes);
    });

    it('deve retornar sucessor se foi renomeado', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado antes da mudança de nome', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

    it('deve retornar sucessor se foi fundido', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b);
    });

    it('não deve retornar partido fundado antes da fusão', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

    it('não deve retornar partido extinto antes do predecessor', function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979, extinto: 2010 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 1979, extinto: 2014 };
      var repo = new ipl.RepositorioDePartidos([ a, b_antes, b_apos ]);
      var resultado = repo.buscaSucessor(a);
      expect(resultado).to.equal(b_apos);
    });

    it('deve busca do cache se chamar duas vezes', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      var repo = new ipl.RepositorioDePartidos([ a, b ]);
      sinon.spy(repo.cache, 'get');
      repo.buscaSucessor(a);
      repo.buscaSucessor(a);
      expect(repo.cache.get).to.have.been.called();
      expect(repo.cache.get).to.have.callCount(1);
    });

  });

});
