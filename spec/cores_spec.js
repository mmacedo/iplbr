'use strict';

describe('ipl.GerenciadorDeCores', function() {

  beforeEach(function() {
    this.cor  = 'vermelho';
    this.tom1 = 'crimson';
    this.tom2 = 'tomato';

    this.paletaComUmTom    = { vermelho: [ this.tom1 ] };
    this.paletaComDoisTons = { vermelho: [ this.tom1, this.tom2 ] };
  });

  describe('(construtor)', function() {

    it('deve usar .CORES_PADRAO por padrão', function() {
      var g = new ipl.GerenciadorDeCores(null);
      expect(g.cores).to.equal(ipl.GerenciadorDeCores.CORES_PADRAO);
    });
  });

  describe('#proxima', function() {

    it('deve retornar uma cor da paleta', function() {
      var g = new ipl.GerenciadorDeCores(null, this.paletaComUmTom);
      expect(g.proxima(this.cor)).to.equal(this.tom1);
    });

    it('deve retornar a segunda this.cor da paleta', function() {
      var g = new ipl.GerenciadorDeCores(null, this.paletaComDoisTons);
      expect(g.proxima(this.cor)).to.equal(this.tom1);
      expect(g.proxima(this.cor)).to.equal(this.tom2);
    });

    it('deve reiterar quando completar a paleta', function() {
      var g = new ipl.GerenciadorDeCores(null, this.paletaComDoisTons);
      expect(g.proxima(this.cor)).to.equal(this.tom1);
      expect(g.proxima(this.cor)).to.equal(this.tom2);
      expect(g.proxima(this.cor)).to.equal(this.tom1);
    });

  });

  describe('#cor', function() {

    beforeEach(function() {
      this.a = { sigla: 'A', numero: 1, fundado: 1979, cor: this.cor };
      this.b = { sigla: 'B', numero: 2, fundado: 1979, cor: this.cor };
      this.c = { sigla: 'C', numero: 3, fundado: 1979, cor: this.cor };
    });

    it('deve retornar uma cor para o partido conforme', function() {
      var partido = this.a;
      var g = new ipl.GerenciadorDeCores(null, this.paletaComUmTom);
      sinon.spy(g, 'proxima');
      expect(g.cor(partido)).to.equal(this.tom1);
      expect(g.proxima).to.have.been.called();
    });

    it('deve retornar a mesma cor para o mesmo partido', function() {
      var partido = this.a;
      var g = new ipl.GerenciadorDeCores(null, this.paletaComDoisTons);
      sinon.spy(g, 'proxima');
      expect(g.cor(partido)).to.equal(this.tom1);
      expect(g.cor(partido)).to.equal(this.tom1);
      expect(g.proxima).to.have.callCount(1);
    });

    it('deve retornar a mesma cor para partido renomeado', function() {
      var partido1 = _.assign({}, this.a, { fundado: 1979, extinto: 1980, renomeado: 'B' });
      var partido2 = _.assign({}, this.b, { fundado: 1980, extinto: 1981, renomeado: 'C' });
      var partido3 = _.assign({}, this.c, { fundado: 1981 });
      var repo = new ipl.RepositorioDePartidos([ partido1, partido2, partido3 ]);
      var g = new ipl.GerenciadorDeCores(repo, this.paletaComDoisTons);
      sinon.spy(g, 'proxima');
      expect(g.cor(partido1)).to.equal(this.tom1);
      expect(g.cor(partido2)).to.equal(this.tom1);
      expect(g.cor(partido3)).to.equal(this.tom1);
      expect(g.proxima).to.have.callCount(1);
    });

  });

});
