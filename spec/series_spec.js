'use strict';

describe('ipl.GeradorDeSeries', function() {

  beforeEach(function() {
    this.cfg = {
      tabelaDeReescrita: null,
      mapeiaPartidos: function(series) {
        return _.map(series, function(p) {
          return _.assign({}, p, {
            sigla:     p.info ? p.info.sigla : null,
            numero:    p.info ? p.info.numero : null,
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

  describe('#geraIndices', function() {

    it('deve retornar as propriedades adequadas', function() {
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.calcula.returns(0.1);
      this.partidos.todos.returns([ { sigla: 'A', numero: 1 } ]);
      var resultado = this.g.geraIndices(this.indice, null, [ 2002 ]);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.have.keys([ 'info', 'indices' ]);
      expect(resultado[0].indices[0]).to.have.keys([ 'ano', 'indice' ]);
    });

    it('deve retornar os índices para todos os partidos', function() {
      this.indice.partidos.returns([ 'A1', 'B2' ]);
      this.indice.calcula.returns(0.1);
      var a = { sigla: 'A', numero: 1 };
      var b = { sigla: 'B', numero: 2 };
      this.partidos.todos.returns([ a, b ]);
      var resultado = this.g.geraIndices(this.indice, null, [ 2002 ]);
      expect(resultado).to.have.length(2);
      expect(_.pluck(resultado, 'info')).to.eql([ a, b ]);
    });

    it('deve retornar os índices para todos os anos', function() {
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.calcula.returns(0.1);
      this.partidos.todos.returns([ { sigla: 'A', numero: 1 } ]);
      var resultado = this.g.geraIndices(this.indice, null, [ 2002, 2006 ]);
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

  describe('#formataParaLinhasOuAreasHighcharts', function() {

    describe('(séries)', function() {

      it('deve retornar séries no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serie = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serie ]);
        expect(resultado[0]).to.contain.all.keys([ 'name', 'data', 'color' ]);
        expect(resultado[0].name).to.equal(serie.sigla);
        expect(resultado[0].data).to.have.length(serie.indices.length);
      });

      it('deve retornar informações adicionais na série', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serie = { info: a, mesclados: [], indices: [] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serie ]);
        expect(resultado[0]).to.contain.keys([ 'partidos' ]);
        expect(resultado[0].partidos).to.eql([ a ]);
      });

      it('deve retornar séries ordenadas pela soma dos índices (descendente)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([
          { info: a, indices: [ { ano: 2002, indice: 0.01 }, { ano: 2006, indice: 0.01 } ] },
          { info: b, indices: [ { ano: 2002, indice: 0.00 }, { ano: 2006, indice: 0.10 } ] }
        ]);
        expect(resultado[0].partidos[0]).to.equal(b);
        expect(resultado[1].partidos[0]).to.equal(a);
      });

      it('não deve somar índices do ano extra adicionado para gráfico em passos', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        this.g.ehGraficoEmPassos = true;
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([
          { info: a, indices: [
            { ano: 2002, indice: 0.00 },
            { ano: 2006, indice: 0.02 },
            { ano: 2007, indice: 0.02 }
          ] },
          { info: b, indices: [
            { ano: 2002, indice: 0.03 },
            { ano: 2006, indice: 0.00 },
            { ano: 2007, indice: 0.00 }
          ] }
        ]);
        expect(resultado[0].partidos[0]).to.equal(b);
        expect(resultado[1].partidos[0]).to.equal(a);
      });

      it('deve retornar resto por último', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([
          { sigla: 'A',     info: a,    indices: [ { ano: 2002, indice: 0.00 } ] },
          { sigla: 'Resto', info: null, indices: [ { ano: 2002, indice: 0.01 } ] }
        ]);
        expect(resultado[0].name).to.equal('A');
        expect(resultado[1].name).to.equal('Resto');
      });

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieA ]);
        expect(resultado[0].data).to.have.length(1);
        expect(resultado[0].data[0]).to.have.keys([ 'x', 'y' ]);
      });

      it('deve retornar datas do ano após o ano da eleição (ms UTC)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieA ]);
        expect(resultado[0].data[0].x).to.eql(Date.UTC(2003, 0, 1));
      });

      it('deve retornar índice como porcentagem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieA ]);
        expect(resultado[0].data[0].y).to.eql(10);
      });

      it('deve retornar pontos ordenados pela data', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [
          { ano: 2004, indice: 0.1 }, { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieA ]);
        expect(resultado[0].data[0].x).to.eql(Date.UTC(2003, 0, 1));
        expect(resultado[0].data[1].x).to.eql(Date.UTC(2005, 0, 1));
      });

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série', function() {
        sinon.spy(this.cores, 'cor');
        var a = { sigla: 'A', numero: 1 };
        this.g.formataParaLinhasOuAreasHighcharts([ { info: a, indices: [] } ]);
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
        var resultado1 = g1.formataParaLinhasOuAreasHighcharts([ serieA, serieB ]);
        var resultado2 = g2.formataParaLinhasOuAreasHighcharts([ serieB, serieA ]);
        expect(resultado1[0].color).to.equal(resultado2[1].color);
        expect(resultado1[1].color).to.equal(resultado2[0].color);
      });

      it('deve retornar linha preta se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { sigla: 'Resto', indices: [] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieResto ]);
        expect(resultado[0].color).to.equal(ipl.GeradorDeSeries.COR_RESTO);
      });

      it('deve retornar linha tracejada se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { sigla: 'Resto', indices: [] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieResto ]);
        expect(resultado[0].dashStyle).to.equal(ipl.GeradorDeSeries.LINHA_RESTO);
      });

      it('não deve retornar linha tracejada se o gráfico for de área', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        this.g.ehGraficoDeArea = true;
        var serieResto = { sigla: 'Resto', indices: [] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieResto ]);
        expect(resultado[0].dashStyle).to.be.undefined();
      });

      it('deve mostrar resto em todos os anos', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { sigla: 'Resto', indices: [
          { ano: 2002, indice: null }, { ano: 2004, indice: 1 }, { ano: 2006, indice: null }
        ] };
        var resultado = this.g.formataParaLinhasOuAreasHighcharts([ serieResto ]);
        expect(resultado[0].data).to.have.length(3);
        expect(resultado[0].data[0].y).to.equal(0);
        expect(resultado[0].data[2].y).to.equal(0);
      });

    });

  });

  describe('#formataParaTortaHighcharts', function() {

    describe('(série)', function() {

      it('deve retornar série única no formato esperado para gráfico de torta', function() {
        var resultado = this.g.formataParaTortaHighcharts([]);
        expect(resultado).to.have.length(1);
        expect(resultado[0]).to.have.keys([ 'type', 'name', 'data' ]);
        expect(resultado[0].type).to.equal('pie');
        expect(resultado[0].name).to.equal('Índice');
      });

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieA ]);
        expect(resultado[0].data).to.have.length(1);
        expect(resultado[0].data[0]).to.contain.keys([ 'name', 'y', 'color' ]);
      });

      it('deve retornar informações adicionais no ponto', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { info: a, mesclados: [], indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieA ]);
        expect(resultado[0].data[0]).to.contain.keys([ 'partidos' ]);
        expect(resultado[0].data[0].partidos).to.eql([ a ]);
      });

      it('deve retornar índice como porcentagem', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieA ]);
        expect(resultado[0].data[0].y).to.eql(10);
      });

      it('deve retornar pontos ordenados pelo índice (descendente)', function() {
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var b = { sigla: 'B', numero: 2, cor: 'azul' };
        var serieA = { sigla: 'A', info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        var serieB = { sigla: 'B', info: b, indices: [ { ano: 2002, indice: 0.2 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieA, serieB ]);
        expect(resultado[0].data[0].partidos[0]).to.equal(b);
        expect(resultado[0].data[1].partidos[0]).to.equal(a);
      });

      it('deve retornar resto por último', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { sigla: 'Resto', info: null, indices: [
          { ano: 2002, indice: 0.2 } ] };
        var a = { sigla: 'A', numero: 1, cor: 'azul' };
        var serieA =     { sigla: 'A',     info: a,    indices: [
          { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieResto, serieA ]);
        expect(resultado[0].data[0].name).to.equal('A');
        expect(resultado[0].data[1].name).to.equal('Resto');
      });

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série', function() {
        sinon.spy(this.cores, 'cor');
        var a = { sigla: 'A', numero: 1 };
        var serieA = { info: a, indices: [ { ano: 2002, indice: 0.1 } ] };
        this.g.formataParaTortaHighcharts([ serieA ]);
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
        var resultado1 = g1.formataParaTortaHighcharts([ serieA, serieB ]);
        var resultado2 = g2.formataParaTortaHighcharts([ serieB, serieA ]);
        expect(resultado1[0].data[0].color).to.equal(resultado2[0].data[1].color);
        expect(resultado1[0].data[1].color).to.equal(resultado2[0].data[0].color);
      });

      it('deve retornar fatia preta se a série for resto', function() {
        this.cfg.tabelaDeReescrita = { resto: 'Resto' };
        var serieResto = { sigla: 'Resto', indices: [ { ano: 2002, indice: 0.1 } ] };
        var resultado = this.g.formataParaTortaHighcharts([ serieResto ]);
        expect(resultado[0].data[0].color).to.equal(ipl.GeradorDeSeries.COR_RESTO);
      });

    });

  });

  describe('#seriesPorRegiao', function() {

    it('deve retornar apenas anos que tem dados', function() {
      this.partidos.todos.returns([ { sigla: 'A', numero: 1, fundado: 1979 } ]);
      this.indice.temDados.withArgs(sinon.match.any, 2002).returns(false);
      this.indice.temDados.withArgs(sinon.match.any, 2006).returns(true);
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.eleicoes.returns([ 2002, 2006 ]);
      var resultado = this.g.seriesPorRegiao(this.indice, null);
      expect(resultado).to.have.length(1);
      expect(resultado[0].data).to.have.length(1);
      expect(resultado[0].data[0].x).to.equal(Date.UTC(2007, 0, 1));
    });

    it('deve adicionar ano extra no final para gráfico em passos', function() {
      this.partidos.todos.returns([ { sigla: 'A', numero: 1, fundado: 1979 } ]);
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.eleicoes.returns([ 2002 ]);
      this.g.ehGraficoEmPassos = true;
      var resultado = this.g.seriesPorRegiao(this.indice, null);
      expect(resultado).to.have.length(1);
      expect(resultado[0].data).to.have.length(2);
      expect(resultado[0].data[0].x).to.equal(Date.UTC(2003, 0, 1));
      expect(resultado[0].data[1].x).to.equal(Date.UTC(2004, 0, 1));
    });

    it('deve filtrar índice pela região', function() {
      this.indice.partidos.returns([ 'A1' ]);
      this.indice.eleicoes.returns([ 2002 ]);
      var regiao = {};
      this.g.seriesPorRegiao(this.indice, regiao);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.same(regiao), sinon.match.any, sinon.match.any);
    });

    it('deve retornar lista vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.seriesPorRegiao(this.indice, null);
      expect(resultado).eql([]);
    });

    it('deve chamar configuração de partidos', function() {
      this.g.seriesPorRegiao(this.indice, null);
      expect(this.cfg.mapeiaPartidos).to.have.been.called();
    });

    it('deve chamar formataParaLinhasOuAreasHighcharts', function() {
      sinon.spy(this.g, 'formataParaLinhasOuAreasHighcharts');
      this.g.seriesPorRegiao(this.indice, null);
      expect(this.g.formataParaLinhasOuAreasHighcharts).to.have.been.called();
    });

  });

  describe('#seriesPorAno', function() {

    it('deve filtrar índice pela região', function() {
      this.indice.partidos.returns([ 'A1' ]);
      var regiao = {};
      this.g.seriesPorAno(this.indice, regiao, null);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.same(regiao), sinon.match.any, sinon.match.any);
    });

    it('deve calcular índice com o ano da eleição', function() {
      this.indice.partidos.returns([ 'A1' ]);
      this.g.seriesPorAno(this.indice, null, 2002);
      expect(this.indice.calcula).to.have.been.called();
      expect(this.indice.calcula).to.have.been.always.calledWith(
        sinon.match.any, 2001, sinon.match.any);
    });

    it('deve retornar série vazia se não tiver dados', function() {
      this.indice.temDados.returns(false);
      var resultado = this.g.seriesPorAno(this.indice, null, null);
      expect(resultado).to.have.length(1);
      expect(resultado[0]).to.have.keys([ 'type', 'name', 'data' ]);
      expect(resultado[0].data).to.have.length(0);
    });

    it('deve chamar configuração de partidos', function() {
      this.g.seriesPorAno(this.indice, null, null);
      expect(this.cfg.mapeiaPartidos).to.have.been.called();
    });

    it('deve chamar formataParaTortaHighcharts', function() {
      sinon.spy(this.g, 'formataParaTortaHighcharts');
      this.g.seriesPorAno(this.indice, null, null);
      expect(this.g.formataParaTortaHighcharts).to.have.been.called();
    });

  });

});
