'use strict';

describe('ipl.Cargo', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos das eleições para o cargo', function() {
      var json = { BR: { deputado_federal: { 2010: {}, 2014: {}, 2018: {} } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.eleicoes('BR')).to.eql([ 2010, 2014, 2018 ]);
    });

    it('não deve retornar a primeira eleição se só renova metade cada eleição', function() {
      var json = { BR: { senador: { 2010: {}, 2014: {}, 2018: {} } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador', 2);
      expect(cargo.eleicoes('BR')).to.eql([ 2014, 2018 ]);
    });

    it('deve retornar apenas os anos das eleições da ue', function() {
      var json = { SC: { vereador: { 2010: {} } }, SP: { vereador: { 2014: {} } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'vereador');
      expect(cargo.eleicoes('SC')).to.eql([ 2010 ]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram na eleição para o cargo', function() {
      var json = { BR: { deputado_federal: { 2010: { por_sigla: { a1: 1, a2: 1 } } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.partidos('BR', 2010)).to.eql([ 'a1', 'a2' ]);
    });

    it('deve retornar apenas os partidos que elegeram na última eleição', function() {
      var json = { BR: { deputado_federal: {
        2010: { por_sigla: { a1: 1 } },
        2014: { por_sigla: { a2: 1 } }
      } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.partidos('BR', 2010)).to.eql([ 'a1' ]);
      expect(cargo.partidos('BR', 2011)).to.eql([ 'a1' ]);
      expect(cargo.partidos('BR', 2012)).to.eql([ 'a1' ]);
      expect(cargo.partidos('BR', 2013)).to.eql([ 'a1' ]);
    });

    it('deve retornar apenas os partidos das eleições na ue', function() {
      var json = {
        SC: { vereador: { 2010: { por_sigla: { a1: 1 } } } },
        SP: { vereador: { 2010: { por_sigla: { a2: 1 } } } }
      };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'vereador');
      expect(cargo.partidos('SC', 2010)).to.eql([ 'a1' ]);
    });

    it('deve retornar também partidos da eleição passada se só renova metade', function() {
      var json = { BR: { senador: {
        2010: { por_sigla: { a1: 1, a2: 1 } },
        2014: { por_sigla: { a1: 1, a3: 1 } }
      } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador', 2);
      expect(cargo.partidos('BR', 2014)).to.eql([ 'a1', 'a2', 'a3' ]);
      expect(cargo.partidos('BR', 2015)).to.eql([ 'a1', 'a2', 'a3' ]);
      expect(cargo.partidos('BR', 2016)).to.eql([ 'a1', 'a2', 'a3' ]);
      expect(cargo.partidos('BR', 2017)).to.eql([ 'a1', 'a2', 'a3' ]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tem um mandato ativo', function() {
      var json = { BR: { deputado_federal: { 2010: { mandato: 4 } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.temDados('BR', 2010)).to.be.true();
      expect(cargo.temDados('BR', 2011)).to.be.true();
      expect(cargo.temDados('BR', 2012)).to.be.true();
      expect(cargo.temDados('BR', 2013)).to.be.true();
    });

    it('deve retornar false se não tem mandato ativo', function() {
      var json = { BR: { deputado_federal: { 2010: { mandato: 4 } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.temDados('BR', 2009)).to.be.false();
      expect(cargo.temDados('BR', 2014)).to.be.false();
    });

    it('deve retornar false se não tem mandato ativo na UE', function() {
      var json = { SC: { vereador: { 2010: {} } }, SP: { vereador: { 2014: {} } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'vereador');
      expect(cargo.temDados('SC', 2014)).to.be.true();
    });

    it('deve retornar true se tem dois mandatos ativos e só renova metade', function() {
      var json = { BR: { senador: { 2010: { mandato: 8 }, 2014: { mandato: 8 } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador', 2);
      expect(cargo.temDados('BR', 2014)).to.be.true();
      expect(cargo.temDados('BR', 2015)).to.be.true();
      expect(cargo.temDados('BR', 2016)).to.be.true();
      expect(cargo.temDados('BR', 2017)).to.be.true();
    });

    it('deve retornar false se tem um mandato ativo e só renova metade', function() {
      var json = { BR: { senador: { 2010: { mandato: 8 }, 2014: { mandato: 8 } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador', 2);
      expect(cargo.temDados('BR', 2013)).to.be.false();
      expect(cargo.temDados('BR', 2018)).to.be.false();
    });

  });

  describe('#quantidade', function() {

    beforeEach(function() {
      this.deputadosFederais = {
        2010: { mandato: 4, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 4, por_sigla: { a1: 1, a2: 1 } }
      };
      this.senadores = {
        2010: { mandato: 8, por_sigla: { a1: 1, a2: 1 } },
        2014: { mandato: 8, por_sigla: { a1: 1, a2: 1 } }
      };
    });

    it('deve jogar exceção se não receber partido', function() {
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral({}), 'presidente');
      function chamada() { cargo.quantidade('BR', 2014, null); }
      expect(chamada).to.throw();
    });

    it('deve retornar o número de eleitos', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.quantidade('BR', 2014, 'a1')).to.equal(1);
    });

    it('deve retornar zero se não o partido não elegeu ninguém', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.quantidade('BR', 2014, 'a3')).to.equal(0);
    });

    it('deve retornar o número de eleitos na última eleição', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.quantidade('BR', 2015, 'a1')).to.equal(1);
      expect(cargo.quantidade('BR', 2016, 'a1')).to.equal(1);
      expect(cargo.quantidade('BR', 2017, 'a1')).to.equal(1);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.quantidade('BR', 2009, 'a1')).to.equal(0);
      expect(cargo.quantidade('BR', 2018, 'a1')).to.equal(0);
    });

    it('deve retornar o número de eleitos de todos mandatos ativos', function() {
      var json = { BR: { senador: this.senadores } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador');
      expect(cargo.quantidade('BR', 2014, 'a1')).to.equal(2);
    });

    it('deve retornar o número de eleitos de mandatos de tamanho não usual', function() {
      var json = { BR: { presidente: { 1989: { mandato: 5, por_sigla: { a1: 1 } } } } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'presidente');
      expect(cargo.quantidade('BR', 1989, 'a1')).to.equal(1);
      expect(cargo.quantidade('BR', 1993, 'a1')).to.equal(1);
    });

  });

  describe('#total', function() {

    beforeEach(function() {
      this.deputadosFederais = {
        2010: { mandato: 4, total: 5 },
        2014: { mandato: 4, total: 2 }
      };
      this.senadores = {
        2010: { mandato: 8, total: 2 },
        2014: { mandato: 8, total: 2 }
      };
    });

    it('deve retornar o total de eleitos', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.total('BR', 2014)).to.equal(2);
    });

    it('deve retornar o total de eleitos na última eleição', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.total('BR', 2015)).to.equal(2);
      expect(cargo.total('BR', 2016)).to.equal(2);
      expect(cargo.total('BR', 2017)).to.equal(2);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: { deputado_federal: this.deputadosFederais } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'deputado_federal');
      expect(cargo.total('BR', 2009)).to.equal(0);
      expect(cargo.total('BR', 2018)).to.equal(0);
    });

    it('deve retornar o total de eleitos de todos mandatos ativos', function() {
      var json = { BR: { senador: this.senadores } };
      var cargo = new ipl.Cargo(new ipl.RepositorioEleitoral(json), 'senador');
      expect(cargo.total('BR', 2014)).to.equal(4);
    });

  });

});

describe('ipl.CargoPorPopulacao', function() {

  describe('#quantidade', function() {

    beforeEach(function() {
      this.populacao = {
        2009:   42,
        2010:  600, 2011:  700, 2012:  800, 2013:  900,
        2014: 1000, 2015: 1100, 2016: 1200, 2017: 1300,
        2018:   42
      };
      this.presidente = { 2014: { total: 1, por_sigla: { a1: 1 } } };
      this.deputadosFederais = {
        2010: { mandato: 4, total: 6, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 4, total: 2, por_sigla: { a1: 1, a2: 1 } }
      };
      this.senadores = {
        2010: { mandato: 8, total: 6, por_sigla: { a1: 3, a2: 3 } },
        2014: { mandato: 8, total: 2, por_sigla: { a1: 1, a2: 1 } }
      };
    });

    it('deve jogar exceção se não receber partido', function() {
      var repo = new ipl.RepositorioEleitoral({});
      var cargo = new ipl.CargoPorPopulacao(repo, 'presidente');
      function chamada() { cargo.quantidade('BR', 2014, null); }
      expect(chamada).to.throw();
    });

    it('deve retornar a população da UE se todos eleitos são do partido', function() {
      var json = { BR: { populacao: this.populacao, presidente: this.presidente } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'presidente');
      expect(cargo.quantidade('BR', 2014, 'a1')).to.equal(1000);
    });

    it('deve retornar metade da população da UE se tem metade dos eleitos', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'deputado_federal');
      expect(cargo.quantidade('BR', 2014, 'a1')).to.equal(this.populacao[2014] / 2);
    });

    it('deve retornar a soma pré-calculada da UF para os municípios', function() {
      var json = { RS: {
        populacao: { 2012: 1000 },
        vereador:  { 2012: { por_sigla: { a1: { populacao: 500 } } } }
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'vereador');
      expect(cargo.quantidade('RS', 2012, 'a1')).to.equal(500);
    });

    it('deve retornar zero se não o partido não elegeu ninguém', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'deputado_federal');
      expect(cargo.quantidade('BR', 2014, 'a3')).to.equal(0);
    });

    it('deve retornar zero se não tem dados no ano', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'deputado_federal');
      expect(cargo.quantidade('BR', 2009)).to.equal(0);
      expect(cargo.quantidade('BR', 2018)).to.equal(0);
    });

    it('deve retornar última eleição proporcional ao ano do índice', function() {
      var json = { BR: {
        populacao:        this.populacao,
        deputado_federal: this.deputadosFederais
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'deputado_federal');
      expect(cargo.quantidade('BR', 2015, 'a1')).to.equal(this.populacao[2015] / 2);
      expect(cargo.quantidade('BR', 2016, 'a1')).to.equal(this.populacao[2016] / 2);
      expect(cargo.quantidade('BR', 2017, 'a1')).to.equal(this.populacao[2017] / 2);
    });

    it('deve retornar todos mandatos ativos proporcional ao ano do índice', function() {
      var json = { BR: { populacao: this.populacao, senador: this.senadores } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo , 'senador');
      expect(cargo.quantidade('BR', 2014, 'a1')).to.equal(this.populacao[2014] / 2);
    });

    it('deve retornar o número de eleitos de mandatos de tamanho não usual', function() {
      var json = { BR: {
        populacao:  { 1989: 500, 1993: 1000 },
        presidente: { 1989: { mandato: 5, total: 1, por_sigla: { a1: 1 } } }
      } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, 'presidente');
      expect(cargo.quantidade('BR', 1989, 'a1')).to.equal(json.BR.populacao[1989]);
      expect(cargo.quantidade('BR', 1993, 'a1')).to.equal(json.BR.populacao[1993]);
    });

  });

  describe('#total', function() {

    it('deve retornar a população da UE', function() {
      var json = { BR: { populacao: { 2014: 1000 } } };
      var repo = new ipl.RepositorioEleitoral(json);
      var cargo = new ipl.CargoPorPopulacao(repo, null);
      expect(cargo.total('BR', 2014)).to.equal(json.BR.populacao[2014]);
    });

  });

});

describe('ipl.IndicePorCargo', function() {

  beforeEach(function() {
    this.cargo = sinon.createStubInstance(ipl.Cargo);
    this.esfera = {
      uesComDados: function() { return [ 'X' ]; },
      todasAsUes:  function() { return [ 'X' ]; }
    };
  });

  describe('#eleicoes', function() {

    it('deve retornar anos que tem eleição para o cargo', function() {
      this.cargo.eleicoes.returns([ 2010 ]);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.eleicoes(null)).to.eql([ 2010 ]);
    });

    it('deve retornar vazio se não tem eleição para o cargo', function() {
      this.cargo.eleicoes.returns([]);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.eleicoes(null)).to.eql([]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que tem representantes do cargo', function() {
      this.cargo.partidos.returns([ 'a1' ]);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.partidos(null, null)).to.eql([ 'a1' ]);
    });

    it('deve retornar vazio se não há representantes do cargo', function() {
      this.cargo.partidos.returns([]);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.partidos(null, null)).to.eql([]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tem dados no ano', function() {
      this.cargo.temDados.returns(true);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.temDados(null, null)).to.be.true();
    });

    it('deve retornar false se não tem dados no ano', function() {
      this.cargo.temDados.returns(false);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.temDados(null, null)).to.be.false();
    });

  });

  describe('#calcula', function() {

    it('deve retornar a proporção da quantidade pelo total', function() {
      this.cargo.quantidade.returns(5);
      this.cargo.total.returns(10);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.calcula(null, null, null)).to.eql(0.5);
    });

    it('deve retornar zero se não tem eleitos pelo partido', function() {
      this.cargo.quantidade.returns(0);
      this.cargo.total.returns(10);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.calcula(null, null, null)).to.eql(0);
    });

    it('deve retornar zero se não tem eleitos no ano', function() {
      this.cargo.quantidade.returns(0);
      this.cargo.total.returns(10);
      var indice = new ipl.IndicePorCargo(this.cargo, this.esfera);
      expect(indice.calcula(null, null, null)).to.eql(0);
    });

  });

});
