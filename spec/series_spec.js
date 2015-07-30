'use strict';

describe('ipl.GeradorDeSeries (general)', function() {

  beforeEach(function() {
    this.cfg      = sinon.createStubInstance(ipl.ConfiguracaoDePartidos);
    this.partidos = sinon.createStubInstance(ipl.RepositorioDePartidos);
    this.cores    = sinon.createStubInstance(ipl.GerenciadorDeCores);
    this.g        = new ipl.GeradorDeSeries(this.cfg, this.partidos, this.cores);
    this.indice   = sinon.createStubInstance(ipl.IndicePorCargo);
    this.indice.temDados.returns(true);
    this.indice.partidos.returns([]);
    this.indice.eleicoes.returns([]);
  });

  describe('#eleicoes', function() {

    it('deve retornar apenas anos que tem dados', function() {
      this.indice.eleicoes.returns([ 2002, 2006 ]);
      this.indice.temDados.withArgs(sinon.match.any, 2002).returns(false);
      this.indice.temDados.withArgs(sinon.match.any, 2006).returns(true);
      var resultado = this.g.eleicoes(this.indice, null);
      expect(resultado).to.eql([ 2006 ]);
    });

    it('deve adicionar ano extra no final para gráfico em passos', function() {
      this.indice.eleicoes.returns([ 2002 ]);
      this.g.ehGraficoEmPassos = true;
      var resultado = this.g.eleicoes(this.indice, null);
      expect(resultado).to.eql([ 2002, 2003 ]);
    });

    it('deve retornar lista vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.eleicoes(this.indice, null);
      expect(resultado).eql([]);
    });

  });

  describe('#idPartidos', function() {

    xit('…');

  });

  describe('#geraIndices', function() {

    it('deve retornar as propriedades adequadas', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.calcula.returns(0.1);
      var resultado = this.g.geraIndices(this.indice, null, 2002, null);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.have.keys([ 'nome', 'fundado', 'extinto', 'info', 'indices' ]);
      expect(resultado[0].indices[0]).to.have.keys([ 'ano', 'indice' ]);
    });

    it('deve retornar os índices para todos os partidos', function() {
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      this.partidos.buscaSiglaENumero.withArgs('A1').returns(a);
      this.partidos.buscaSiglaENumero.withArgs('B2').returns(b);
      this.indice.partidos.returns([ 'A1', 'B2' ]);
      this.indice.calcula.returns(0.1);
      var resultado = this.g.geraIndices(this.indice, null, 2002, null);
      expect(resultado).to.have.length(2);
      expect(_.pluck(resultado, 'info')).to.eql([ a, b ]);
    });

    it('deve retornar os índices para todos os anos', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.indice.eleicoes.returns([ 2002, 2006 ]);
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.calcula.returns(0.1);
      var resultado = this.g.geraIndices(this.indice, null, null, null);
      var esperado = [ { ano: 2002, indice: 0.1 }, { ano: 2006, indice: 0.1 } ];
      expect(resultado[0].indices).to.have.length(2);
      expect(resultado[0].indices).to.eql(esperado);
    });

  });

  describe('#filtraAnos', function() {

    beforeEach(function() {
      this.indices = [
        { ano: 2002, indice: 0.1 },
        { ano: 2006, indice: 0.1 },
        { ano: 2010, indice: 0.1 }
      ];
    });

    it('deve manter anos que o partido existe', function() {
      var serie = { info: null, indices: this.indices, fundado: 2002, extinto: 2010 };
      var resultado = this.g.filtraAnos([ serie ]);
      expect(resultado[0].indices).to.have.length(3);
      expect(resultado[0].indices).to.eql(this.indices);
    });

    it('deve manter anos que o partido existe se ele não foi exitnto', function() {
      var serie = { info: null, indices: this.indices, fundado: 2002 };
      var resultado = this.g.filtraAnos([ serie ]);
      expect(resultado[0].indices).to.have.length(3);
      expect(resultado[0].indices).to.eql(this.indices);
    });

    it('deve remover anos antes de ser fundado se manterNulos=false', function() {
      var serie = { info: null, indices: this.indices, fundado: 2006, extinto: 2010 };
      this.indices[0].indice = 0;
      var resultado = this.g.filtraAnos([ serie ], false);
      expect(resultado[0].indices).to.have.length(2);
      expect(resultado[0].indices).to.eql([ this.indices[1], this.indices[2] ]);
    });

    it('deve manter anos antes de ser fundado como nulos se manterNulos=true', function() {
      var serie = { info: null, indices: this.indices, fundado: 2006, extinto: 2010 };
      this.indices[0].indice = 0;
      var resultado = this.g.filtraAnos([ serie ], true);
      expect(resultado[0].indices).to.have.length(3);
      expect(resultado[0].indices[0]).to.eql({ ano: 2002, indice: null });
      expect(resultado[0].indices[1]).to.eql(this.indices[1]);
      expect(resultado[0].indices[2]).to.eql(this.indices[2]);
    });

    it('deve remover anos após ser extinto se manterNulos=false', function() {
      var serie = { info: null, indices: this.indices, fundado: 2002, extinto: 2006 };
      this.indices[2].indice = 0;
      var resultado = this.g.filtraAnos([ serie ], false);
      expect(resultado[0].indices).to.have.length(2);
      expect(resultado[0].indices).to.eql([ this.indices[0], this.indices[1] ]);
    });

    it('não deve remover anos após ser extinto se manterNulos=true', function() {
      var serie = { info: null, indices: this.indices, fundado: 2002, extinto: 2006 };
      this.indices[2].indice = 0;
      var resultado = this.g.filtraAnos([ serie ], true);
      expect(resultado[0].indices).to.have.length(3);
      expect(resultado[0].indices[0]).to.eql(this.indices[0]);
      expect(resultado[0].indices[1]).to.eql(this.indices[1]);
      expect(resultado[0].indices[2]).to.eql({ ano: 2010, indice: 0 });
    });

  });

  describe('#filtraPartidos', function() {

    it('deve retornar inalterado se o partido tiver índice', function() {
      var serie = { info: null, indices: [ { ano: 2002, indice: 0.1 } ] };
      var resultado = this.g.filtraPartidos([ serie ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.eql(serie);
    });

    it('deve remover partidos que não tem índices', function() {
      var serie = { info: null, indices: [] };
      var resultado = this.g.filtraPartidos([ serie ]);
      expect(resultado).to.have.length(0);
    });

  });

});
