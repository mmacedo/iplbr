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

  describe('#seriesHighcharts', function() {

    describe('(séries)', function() {

      it('deve retornar séries no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serie = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.seriesHighcharts([ serie ]);
        expect(resultado[0]).to.contain.keys([ 'name', 'data', 'color' ]);
        expect(resultado[0].name).to.equal(serie.nome);
        expect(resultado[0].data).to.have.length(serie.indices.length);
      });

      it('deve retornar informações adicionais na série', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serie = { info: a, mesclados: [], indices: [] };
        var resultado = this.g.seriesHighcharts([ serie ]);
        expect(resultado[0]).to.contain.keys([ 'partidos' ]);
        expect(resultado[0].partidos).to.eql([ a ]);
      });

      it('deve retornar séries ordenadas pela soma dos índices (descendente)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        var resultado = this.g.seriesHighcharts([
          { info: a, indices: [ { ano: 2002, indice: 0.01 }, { ano: 2006, indice: 0.01 } ] },
          { info: b, indices: [ { ano: 2002, indice: 0.00 }, { ano: 2006, indice: 0.10 } ] }
        ]);
        expect(resultado[0].partidos[0]).to.equal(b);
        expect(resultado[1].partidos[0]).to.equal(a);
      });

      it('deve retornar resto por último', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var resultado = this.g.seriesHighcharts([
          { nome: 'A',     info: a,    indices: [ { ano: 2002, indice: 0.00 } ] },
          { nome: 'Resto', info: null, indices: [ { ano: 2002, indice: 0.01 } ] }
        ]);
        expect(resultado[0].name).to.equal('A');
        expect(resultado[1].name).to.equal('Resto');
      });

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.seriesHighcharts([ serieA ]);
        expect(resultado[0].data).to.have.length(1);
        expect(resultado[0].data[0]).to.have.keys([ 'x', 'y' ]);
      });

      it('deve retornar datas do ano após o ano da eleição (ms UTC)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.seriesHighcharts([ serieA ]);
        expect(new Date(resultado[0].data[0].x).getUTCFullYear()).to.equal(2003);
        expect(resultado[0].data[0].x).to.eql(Date.UTC(2003, 0, 1));
      });

      it('deve retornar índice como porcentagem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.seriesHighcharts([ serieA ]);
        expect(resultado[0].data[0].y).to.equal(10);
      });

      it('deve retornar pontos ordenados pela data', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [
          { ano: 2004, indice: 0.1 }, { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.seriesHighcharts([ serieA ]);
        expect(new Date(resultado[0].data[0].x).getUTCFullYear()).to.equal(2003);
        expect(new Date(resultado[0].data[1].x).getUTCFullYear()).to.equal(2005);
      });

      it('deve adicionar ano extra no final para gráfico em passos', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        this.g.ehGraficoEmPassos = true;
        var resultado = this.g.seriesHighcharts([
          { info: a, indices: [ { ano: 2002, indice: 0.01 }, { ano: 2006, indice: 0.02 } ] }
        ]);
        expect(new Date(resultado[0].data[1].x).getUTCFullYear()).to.equal(2007);
        expect(new Date(resultado[0].data[2].x).getUTCFullYear()).to.equal(2008);
      });

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série', function() {
        sinon.spy(this.cores, 'cor');
        var a = { sigla: 'A', numero: 1 };
        this.g.seriesHighcharts([ { info: a, indices: [] } ]);
        expect(this.cores.cor).to.have.been.called();
      });

      it('deve retornar a mesma cor para o mesmo partido independente da ordem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        this.partidos.todos.returns([ a, b ]);
        var serieA = { info: a, indices: [] };
        var serieB = { info: b, indices: [] };
        var cores1 = new ipl.GerenciadorDeCores(this.partidos);
        var cores2 = new ipl.GerenciadorDeCores(this.partidos);
        var g1 = new ipl.GeradorDeSeries(this.cfg, this.partidos, cores1);
        var g2 = new ipl.GeradorDeSeries(this.cfg, this.partidos, cores2);
        var resultado1 = g1.seriesHighcharts([ serieA, serieB ]);
        var resultado2 = g2.seriesHighcharts([ serieB, serieA ]);
        expect(resultado1[0].color).to.equal(resultado2[1].color);
        expect(resultado1[1].color).to.equal(resultado2[0].color);
      });

      it('deve retornar linha preta se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { nome: 'Resto', indices: [] };
        var resultado = this.g.seriesHighcharts([ serieResto ]);
        expect(resultado[0].color).to.equal(ipl.GeradorDeSeries.COR_RESTO);
      });

      it('deve retornar linha tracejada se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { nome: 'Resto', indices: [] };
        var resultado = this.g.seriesHighcharts([ serieResto ]);
        expect(resultado[0].dashStyle).to.equal(ipl.GeradorDeSeries.LINHA_RESTO);
      });

      it('não deve retornar linha tracejada se o gráfico for de área', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        this.g.ehGraficoDeArea = true;
        var serieResto = { nome: 'Resto', indices: [] };
        var resultado = this.g.seriesHighcharts([ serieResto ]);
        expect(resultado[0].dashStyle).to.be.undefined();
      });

      it('deve mostrar resto em todos os anos', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { nome: 'Resto', indices: [
          { ano: 2002, indice: null }, { ano: 2004, indice: 1 }, { ano: 2006, indice: null }
        ] };
        var resultado = this.g.seriesHighcharts([ serieResto ]);
        expect(resultado[0].data).to.have.length(3);
        expect(resultado[0].data[0].y).to.equal(0);
        expect(resultado[0].data[2].y).to.equal(0);
      });

    });

  });

  describe('#serieTortaHighcharts', function() {

    describe('(série)', function() {

      it('deve retornar série única no formato esperado para gráfico de torta', function() {
        var resultado = this.g.serieTortaHighcharts([]);
        expect(resultado).to.have.keys([ 'type', 'name', 'data' ]);
        expect(resultado.type).to.equal('pie');
        expect(resultado.name).to.equal('Índice');
      });

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieA ]);
        expect(resultado.data).to.have.length(1);
        expect(resultado.data[0]).to.contain.keys([ 'name', 'y', 'color' ]);
      });

      it('deve retornar informações adicionais no ponto', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { info: a, mesclados: [], indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieA ]);
        expect(resultado.data[0]).to.contain.keys([ 'partidos' ]);
        expect(resultado.data[0].partidos).to.eql([ a ]);
      });

      it('deve retornar índice como porcentagem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieA ]);
        expect(resultado.data[0].y).to.eql(10);
      });

      it('deve retornar pontos ordenados pelo índice (descendente)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        var serieA = { nome: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var serieB = { nome: 'B', info: b, indices: [ { ano: 2002, indice: 0.2 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieA, serieB ]);
        expect(resultado.data[0].partidos[0]).to.equal(b);
        expect(resultado.data[1].partidos[0]).to.equal(a);
      });

      it('deve retornar resto por último', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { nome: 'Resto', info: null, indices: [
          { ano: 2002, indice: 0.2 } ] };
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA =     { nome: 'A',     info: a,    indices: [
          { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieResto, serieA ]);
        expect(resultado.data[0].name).to.equal('A');
        expect(resultado.data[1].name).to.equal('Resto');
      });

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série', function() {
        sinon.spy(this.cores, 'cor');
        var a = { sigla: 'A', numero: 1 };
        var serieA = { info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        this.g.serieTortaHighcharts([ serieA ]);
        expect(this.cores.cor).to.have.been.called();
      });

      it('deve retornar a mesma cor para o mesmo partido independente da ordem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        this.partidos.todos.returns([ a, b ]);
        var serieA = { info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var serieB = { info: b, indices: [ { ano: 2002, indice: 0.1 } ] };
        var cores1 = new ipl.GerenciadorDeCores(this.partidos);
        var cores2 = new ipl.GerenciadorDeCores(this.partidos);
        var g1 = new ipl.GeradorDeSeries(this.cfg, this.partidos, cores1);
        var g2 = new ipl.GeradorDeSeries(this.cfg, this.partidos, cores2);
        var resultado1 = g1.serieTortaHighcharts([ serieA, serieB ]);
        var resultado2 = g2.serieTortaHighcharts([ serieB, serieA ]);
        expect(resultado1.data[0].color).to.equal(resultado2.data[1].color);
        expect(resultado1.data[1].color).to.equal(resultado2.data[0].color);
      });

      it('deve retornar fatia preta se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { nome: 'Resto', indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.serieTortaHighcharts([ serieResto ]);
        expect(resultado.data[0].color).to.equal(ipl.GeradorDeSeries.COR_RESTO);
      });

    });

  });

  describe('#serieRadarHighcharts', function() {

    xit('…');

  });

});
