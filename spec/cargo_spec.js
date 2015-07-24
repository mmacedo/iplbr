'use strict';

describe('ipl.Cargo', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos das eleições para o cargo');

    it('não deve retornar a primeira eleição se só renova metade cada eleição');

    it('deve retornar apenas os anos das eleições da ue');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram na eleição para o cargo');

    it('deve retornar apenas os partidos que elegeram no ano');

    it('deve retornar apenas os partidos das eleições na ue');

    it('deve retornar os partidos de todos os mandatos ativos');

  });

  describe('#temDados', function() {

    it('deve retornar true se tem eleição no ano');

    it('deve retornar true se tem um mandato ativo');

    it('deve retornar false se não tem mandato ativo');

    it('deve retornar false se não tem mandato ativo na UE');

    it('deve retornar true se tem dois mandatos ativos e só renova metade');

    it('deve retornar false se tem um mandato ativo e só renova metade');

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

  describe('#anos', function() {

    it('deve retornar anos que tem dados para o cargo');

    it('deve retornar vazio se não tem dados para o cargo');

    it('deve retornar vazio se não tem dados para a UE');

    it('não deve retornar ano que só tem metade do _senado_');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que tem eleitos do cargo');

    it('deve retornar vazio se não tem eleição no ano');

    it('deve retornar vazio se não tem cargo na UE');

  });

  describe('#temDados', function() {

    it('deve retornar true se tem eleição no ano');

    it('deve retornar true se tem um mandato ativo');

    it('deve retornar false se não tem mandato ativo');

    it('deve retornar false se não tem mandato ativo na UE');

    it('deve retornar true se tem dois mandatos ativos e só renova metade');

    it('deve retornar false se tem um mandato ativo e só renova metade');

  });

  describe('#calcula', function() {

    it('deve retornar a proporção da quantidade pelo total');

    it('deve retornar a proporção multiplicada pelo peso');

    it('deve retornar zero se não tem eleitos pelo partido');

    it('deve retornar zero se não tem eleitos no ano');

    it('deve retornar índices que somam 1 no ano');

  });

});
