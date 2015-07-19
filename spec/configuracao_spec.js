'use strict';

describe('ipl.ConfiguracaoDePartidos', function() {

  describe('#mesclarPartidosExtintos', function() {

    function geraInput(partido) {
      return {
        sigla:     partido.sigla,
        numero:    partido.numero,
        info:      partido,
        fundado:   partido.fundado,
        extinto:   partido.extinto,
        mesclados: [],
        indices:   []
      };
    }

    it('deve retornar inalterado se não tem sucessor', function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012 };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      var partidos = [ a, b ];
      var repo = new ipl.RepositorioDePartidos(partidos);
      var cfg = new ipl.ConfiguracaoDePartidos(repo);
      _.set(cfg, { mudancasDeNome: true, incorporacoes: true, fusoes: true });
      var dados = _.map(partidos, geraInput);
      var resultado = cfg.mesclarPartidosExtintos(dados);
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
        sinon.spy(this.repo, 'buscarSucessor');
        var resultado = this.cfg.mesclarPartidosExtintos(this.dados);
        expect(resultado.length).to.equal(1);
        expect(_.find(resultado, _.pick(this.a, [ 'sigla', 'numero' ]))).not.to.be.ok();
        expect(this.repo.buscarSucessor).to.have.been.called();
      });

      it('não deve mesclar se não estiver configurado para mesclar', function() {
        this.cfg.incorporacoes = false;
        sinon.spy(this.repo, 'buscarSucessor');
        var resultado = this.cfg.mesclarPartidosExtintos(this.dados);
        expect(resultado.length).to.equal(2);
        expect(_.find(resultado, _.pick(this.a, [ 'sigla', 'numero' ]))).to.be.ok();
        expect(this.repo.buscarSucessor).not.to.have.been.called();
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
        _.set(this.cfg, { mudancasDeNome: true, incorporacoes: true, fusoes: true });
      });

      it('deve manter a data de fundação do mais antigo', function() {
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclarPartidosExtintos(dados);
        expect(resultado.length).to.equal(1);
        expect(resultado[0].fundado).to.equal(this.maisAntigo.fundado);
      });

      it('deve manter a data de dissolução do último extinto', function() {
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclarPartidosExtintos(dados);
        expect(resultado.length).to.equal(1);
        expect(resultado[0].extinto).to.equal(this.ultimoExtinto.extinto);
      });

      it('não deve ser extinto se algum deles não foi extinto', function() {
        this.ultimoExtinto.extinto = null;
        var dados = _.map(this.partidos, geraInput);
        var resultado = this.cfg.mesclarPartidosExtintos(dados);
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
      var resultado = cfg.mesclarPartidosExtintos(dados);
      expect(resultado.length).to.equal(1);
      expect(resultado[0].indices).to.eql(esperado);
    });

  });

});
