'use strict';

describe('ipl.GeradorDeSeries (Highcharts)', function() {

  beforeEach(function() {
    this.cfg = {
      tabelaDeReescrita: null,
      mapeiaPartidos: function(series) {
        return _.map(series, function(p) {
          return _.assign({}, p, {
            nome:      p.info ? p.info.sigla : null,
            fundado:   p.info ? p.info.fundado : null,
            extinto:   p.info ? p.info.extinto : null,
            mesclados: []
          });
        });
      }
    };
    sinon.spy(this.cfg, 'mapeiaPartidos');
    this.partidos = sinon.createStubInstance(ipl.RepositorioDePartidos);
    this.cores    = { cor: function() { return 'blue'; } };
    this.g        = new ipl.GeradorDeSeries(this.cfg, this.partidos, this.cores);
    this.indice   = sinon.createStubInstance(ipl.IndicePorCargo);
    this.indice.temDados.returns(true);
    this.indice.partidos.returns([]);
    this.indice.eleicoes.returns([]);
  });

  describe('#evolucaoDoIndice', function() {

    it('deve retornar lista vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.evolucaoDoIndice(this.indice, null);
      expect(resultado).eql([]);
    });

    it('deve filtrar índice pela região', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.eleicoes.returns([ 2002 ]);
      var regiao = {};
      this.g.evolucaoDoIndice(this.indice, regiao);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.same(regiao), sinon.match.any, sinon.match.any);
    });

    it('deve chamar configuração de partidos', function() {
      this.g.evolucaoDoIndice(this.indice, null);
      expect(this.cfg.mapeiaPartidos).to.have.been.called();
    });

    it('deve chamar seriesHighcharts', function() {
      sinon.spy(this.g, 'seriesHighcharts');
      this.g.evolucaoDoIndice(this.indice, null);
      expect(this.g.seriesHighcharts).to.have.been.called();
    });

  });

  describe('#evolucaoDoIndicePorPartido', function() {

    it('deve retornar lista vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.evolucaoDoIndicePorPartido(this.indice, null, null);
      expect(resultado).eql([]);
    });

    it('deve filtrar índice pela região', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.partidos.buscaPredecessores.returns([ { sigla: 'A', numero: 1 } ]);
      this.indice.eleicoes.returns([ 2002 ]);
      var regiao = {};
      this.g.evolucaoDoIndicePorPartido(this.indice, regiao, 'A1');
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.callCount(1);
      expect(this.indice.calcula).to.have.been.calledWith(
        sinon.match.same(regiao), sinon.match.any, 'A1');
    });

    xit('deve chamar configuração de partidos', function() {
      this.g.evolucaoDoIndicePorPartido(this.indice, null, 'A1');
      expect(this.cfg.mapeiaPartidos).to.have.been.called();
    });

    it('deve chamar seriesHighcharts', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      sinon.spy(this.g, 'seriesHighcharts');
      this.g.evolucaoDoIndicePorPartido(this.indice, null, 'A1');
      expect(this.g.seriesHighcharts).to.have.been.called();
    });

  });

  describe('#indiceNoAno', function() {

    it('deve retornar série vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.indiceNoAno(this.indice, null, null);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.have.keys([ 'type', 'name', 'data' ]);
      expect(resultado[0].data).to.have.length(0);
    });

    it('deve filtrar índice pela região', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.indice.partidos.returns([ 'A1' ]);
      var regiao = {};
      this.g.indiceNoAno(this.indice, regiao, null);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.same(regiao), sinon.match.any, sinon.match.any);
    });

    it('deve calcular índice com o ano da eleição', function() {
      this.partidos.buscaSiglaENumero.returns({ sigla: 'A', numero: 1 });
      this.indice.partidos.returns([ 'A1' ]);
      this.g.indiceNoAno(this.indice, null, 2002);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.any, 2001, sinon.match.any);
    });

    it('deve chamar configuração de partidos', function() {
      this.g.indiceNoAno(this.indice, null, null);
      expect(this.cfg.mapeiaPartidos).to.have.been.called();
    });

    it('deve chamar serieTortaHighcharts', function() {
      sinon.spy(this.g, 'serieTortaHighcharts');
      this.g.indiceNoAno(this.indice, null, null);
      expect(this.g.serieTortaHighcharts).to.have.been.called();
    });

  });

  describe('#indiceNoAnoPorPartido', function() {

    xit('…');

  });

});
