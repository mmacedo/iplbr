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
