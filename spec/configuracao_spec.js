'use strict';

describe('ipl.ConfiguracaoDePartidos', function() {

  describe('#mesclaPartidosExtintos', function() {

    function geraInput(partido) {
      return {
        nome:     partido.sigla,
        fundado:   partido.fundado,
        extinto:   partido.extinto,
        info:      partido,
        indices:   [],
        mesclados: []
      };
    }

    it('deve retornar inalterado se não tem sucessor', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012 };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      var partidos = [ a, b ];
      var repo = new ipl.RepositorioDePartidos(partidos);
      var cfg = new ipl.ConfiguracaoDePartidos(repo);
      _.assign(cfg, { mudancasDeNome: true, incorporacoes: true, fusoes: true });
      var dados = _.map(partidos, geraInput);
      var resultado = cfg.mesclaPartidosExtintos(dados);
      expect(resultado).to.eql(dados);
    });

    describe('(configuração)', function() {

      beforeEach(function() {
        this.a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
        var b = { sigla: 'B', numero: 2, fundado: 1979 };
        var partidos = [ this.a, b ];
        this.repo = new ipl.RepositorioDePartidos(partidos);
        this.cfg = new ipl.ConfiguracaoDePartidos(this.repo);
        this.dados = _.map(partidos, geraInput);
      });

      it('deve mesclar se estiver configurado para mesclar', function() {
        this.cfg.incorporacoes = true;
        sinon.spy(this.repo, 'buscaSucessor');
        var resultado = this.cfg.mesclaPartidosExtintos(this.dados);
        expect(resultado.length).to.equal(1);
        expect(_.find(resultado, 'nome', this.a.sigla)).not.to.be.ok();
        expect(this.repo.buscaSucessor).to.have.been.called();
      });

      it('não deve mesclar se não estiver configurado para mesclar', function() {
        this.cfg.incorporacoes = false;
        sinon.spy(this.repo, 'buscaSucessor');
        var resultado = this.cfg.mesclaPartidosExtintos(this.dados);
        expect(resultado.length).to.equal(2);
        expect(_.find(resultado, 'nome', this.a.sigla)).to.be.ok();
        expect(this.repo.buscaSucessor).not.to.have.been.called();
      });

    });

    describe('(datas)', function() {

      beforeEach(function() {
        var a = { sigla: 'A', numero: 1, fundado: 1980, extinto: 1981, incorporado: 'B' };
        var b = { sigla: 'B', numero: 2, fundado: 1979, extinto: 1982, fusao: 'D' };
        var c = { sigla: 'C', numero: 3, fundado: 1981, extinto: 1982, fusao: 'D' };
        var d = { sigla: 'D', numero: 4, fundado: 1982, extinto: 1983, renomeado: 'E' };
        var e = { sigla: 'E', numero: 5, fundado: 1983, extinto: 1984 };
        this.maisAntigo = b;
        this.ultimoExtinto = e;
        this.partidos = [ a, b, c, d, e ];
        var repo = new ipl.RepositorioDePartidos(this.partidos);
        this.cfg = new ipl.ConfiguracaoDePartidos(repo);
        _.assign(this.cfg, { mudancasDeNome: true, incorporacoes: true, fusoes: true });
      });

      it('deve manter a data de fundação do mais antigo', function() {
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclaPartidosExtintos(dados);
        expect(resultado.length).to.equal(1);
        expect(resultado[0].fundado).to.equal(this.maisAntigo.fundado);
      });

      it('deve manter a data de dissolução do último extinto', function() {
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclaPartidosExtintos(dados);
        expect(resultado.length).to.equal(1);
        expect(resultado[0].extinto).to.equal(this.ultimoExtinto.extinto);
      });

      it('não deve ser extinto se algum deles não foi extinto', function() {
        this.ultimoExtinto.extinto = null;
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclaPartidosExtintos(dados);
        expect(resultado.length).to.equal(1);
        expect(resultado[0].extinto).to.be.null();
      });

    });

    it('deve somar os índices', function() {
      var a = { sigla: 'A', numero: 1, fundado: 2002, extinto: 2006, fusao: 'C' };
      var b = { sigla: 'B', numero: 2, fundado: 2006, extinto: 2006, fusao: 'C' };
      var c = { sigla: 'C', numero: 3, fundado: 2006, extinto: 2010, incorporado: 'D' };
      var d = { sigla: 'D', numero: 4, fundado: 2006, extinto: 2014 };
      var partidos = [ a, b, c, d ];
      var repo = new ipl.RepositorioDePartidos(partidos);
      var cfg = new ipl.ConfiguracaoDePartidos(repo);
      _.assign(cfg, { mudancasDeNome: true, incorporacoes: true, fusoes: true });
      // jscs:disable maximumLineLength
      var indices = [
        [              { ano: 2002, indice: 1 }, { ano: 2006, indice: 1 } ],
        [                                        { ano: 2006, indice: 2 } ],
        [                                                                  { ano: 2010, indice: 1 } ],
        [                                        { ano: 2006, indice: 4 }, { ano: 2010, indice: 2 }, { ano: 2014, indice: 1 } ]
      ];
      var dados = _.zipWith(partidos, indices, function(partido, indices) {
        return _.assign(geraInput(partido), { indices: indices });
      });
      var esperado = [ { ano: 2002, indice: 1 }, { ano: 2006, indice: 7 }, { ano: 2010, indice: 3 }, { ano: 2014, indice: 1 } ];
      // jscs:enable maximumLineLength
      var resultado = cfg.mesclaPartidosExtintos(dados);
      expect(resultado.length).to.equal(1);
      expect(resultado[0].indices).to.eql(esperado);
    });

  });

  describe('#desambiguaSiglas', function() {

    it('deve retornar inalterado se não tem siglas repetidas', function() {
      var a = { sigla: 'A', fundado: 1979 };
      var b = { sigla: 'B', fundado: 1979 };
      var partidos = new ipl.RepositorioDePartidos([ a, b ]);
      var cfg = new ipl.ConfiguracaoDePartidos(partidos);
      var resultado = cfg.desambiguaSiglas([ { info: a }, { info: b } ]);
      var esperado = [ { nome: 'A', info: a }, { nome: 'B', info: b } ];
      expect(resultado).to.eql(esperado);
    });

    it('deve desambiguar o mais antigo se tiver sigla repretida', function() {
      var a1 = { sigla: 'A', fundado: 1979, naoEhUltimo: true };
      var a2 = { sigla: 'A', fundado: 1980 };
      var partidos = new ipl.RepositorioDePartidos([ a1, a2 ]);
      var cfg = new ipl.ConfiguracaoDePartidos(partidos);
      var resultado = cfg.desambiguaSiglas([ { info: a1 }, { info: a2 } ]);
      var esperado = [ { nome: 'A (1979)', info: a1 }, { nome: 'A', info: a2 } ];
      expect(resultado).to.eql(esperado);
    });

  });

  describe('#agrupaPartidos', function() {

    it('deve retornar como resto se não estiver mapeado', function() {
      var partido = { sigla: 'A', numero: 1 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ partido ]));
      cfg.tabelaDeReescrita = { mapear: [], resto: _.constant('Resto') };
      var resultado = cfg.agrupaPartidos([ { info: partido } ]);
      expect(resultado[0].nome).to.equal('Resto');
    });

    it('deve retornar nova sigla se estiver mapeado', function() {
      var partido = { sigla: 'A', numero: 1 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ partido ]));
      cfg.tabelaDeReescrita = { mapear: [ { de: { sigla: 'A', numero: 1 }, para: 'B' } ] };
      var resultado = cfg.agrupaPartidos([ { info: partido } ]);
      expect(resultado[0].nome).to.equal('B');
    });

    it('deve mesclar se mais de um não estiver mapeado', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = { mapear: [], resto: _.constant('Resto') };
      var resultado = cfg.agrupaPartidos([
        { info: a, indices: [] }, { info: b, indices: [] }
      ]);
      expect(resultado[0].nome).to.equal('Resto');
    });

    it('deve mesclar se mais de um estiver mapeado para a mesma sigla', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'C' }, { de: b, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, indices: [] }, { info: b, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].nome).to.equal('C');
    });

    it('deve somar os índices', function() {
      // jscs:disable maximumLineLength
      var a = { sigla: 'A', numero: 1 };
      var a_indices = [ { ano: 2002, indice: 1 }, { ano: 2006, indice: 1 } ];
      var b = { sigla: 'B', numero: 2 };
      var b_indices = [                           { ano: 2006, indice: 2 }, { ano: 2010, indice: 1 } ];
      var c_indices = [ { ano: 2002, indice: 1 }, { ano: 2006, indice: 3 }, { ano: 2010, indice: 1 } ];
      // jscs:enable maximumLineLength
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'C' }, { de: b, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, indices: a_indices }, { info: b, indices: b_indices }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].indices).to.eql(c_indices);
    });

    it('deve retornar informações do primeiro mapeado', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: b, para: 'C' }, { de: a, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, indices: [] }, { info: b, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].info).to.equal(b);
    });

    it('deve retornar informações do primeiro mapeado que tem dados', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var c = { sigla: 'C', numero: 3 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b, c ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'D' }, { de: b, para: 'D' }, { de: c, para: 'D' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        // Não elegeu representantes
        //  logo, não foi retornada em ipl.Indice#partidos
        //  logo, não foi passada nesse método
        { info: b, indices: [] }, { info: c, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].info).to.equal(b);
    });

    it('deve manter a data de fundação do mais antigo', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'C' }, { de: b, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, fundado: 1980, indices: [] }, { info: b, fundado: 1979, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].fundado).to.equal(1979);
    });

    it('deve retornar a data de dissolução do último extinto', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'C' }, { de: b, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, extinto: 1980, indices: [] }, { info: b, extinto: 1979, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].extinto).to.equal(1980);
    });

    it('não deve ser extinto se algum deles não foi extinto', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ a, b ]));
      cfg.tabelaDeReescrita = {
        mapear: [ { de: a, para: 'C' }, { de: b, para: 'C' } ],
        resto: _.noop
      };
      var resultado = cfg.agrupaPartidos([
        { info: a, indices: [] }, { info: b, extinto: 1979, indices: [] }
      ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0].extinto).to.be.null();
    });

  });

  describe('#mapeiaPartidos', function() {

    it('deve retornar as propriedades necessárias', function() {
      var info = { sigla: 'A', numero: 1, fundado: 1979, extinto: 1980 };
      var indices = [ { ano: 1979, indice: 1 } ];
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([ info ]));
      var serie = {
        nome: info.sigla,
        fundado: info.fundado,
        extinto: info.extinto,
        info: info,
        indices: indices
      };
      var resultado = cfg.mapeiaPartidos([ serie ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.have.all.keys([
        'nome', 'fundado', 'extinto',
        'info', 'indices', 'mesclados'
      ]);
    });

    it('deve chamar desambiguaSiglas se não tem tabela de reescrita', function() {
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([]));
      cfg.tabelaDeReescrita = null;
      sinon.spy(cfg, 'desambiguaSiglas');
      cfg.mapeiaPartidos();
      expect(cfg.desambiguaSiglas).to.have.been.called();
    });

    it('deve chamar agrupaPartidos se tem tabela de reescrita', function() {
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([]));
      cfg.tabelaDeReescrita = {};
      sinon.spy(cfg, 'agrupaPartidos');
      cfg.mapeiaPartidos();
      expect(cfg.agrupaPartidos).to.have.been.called();
    });

    it('deve chamar mesclaPartidosExtintos se tem configuração', function() {
      var cfg = new ipl.ConfiguracaoDePartidos(new ipl.RepositorioDePartidos([]));
      sinon.spy(cfg, 'mesclaPartidosExtintos');
      cfg.mapeiaPartidos();
      expect(cfg.mesclaPartidosExtintos).to.have.been.called();
    });

  });

});
