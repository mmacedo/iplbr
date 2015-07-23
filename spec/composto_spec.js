'use strict';

describe('ipl.IndiceBicameral', function() {

  describe('#anos', function() {

    it('deve retornar anos com eleição em qualquer das casas');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram em qualquer das casas');

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para as duas casas');

    it('deve retornar false se não tiver dados para pelo menos uma das casas');

  });

  describe('#calcula', function() {

    it('deve retornar a média das duas casas');

  });

});

describe('ipl.IndiceSomaDf', function() {

  describe('#anos', function() {

    it('deve retornar anos com eleição nos estados ou no DF');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram nos estados ou no DF');

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para os estados e para o DF');

    it('deve retornar false se não tiver nos estados ou no DF');

  });

  describe('#calcula', function() {

    it('deve retornar a soma dos índices de dos estados e do DF');

    it('deve retornar índices que somam 1 no ano');

  });

});

describe('ipl.IndiceEsfera', function() {

  describe('#anos', function() {

    it('deve retornar anos com eleição no legislativo ou no executivo');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram no legislativo ou no executivo');

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para os dois poderes');

    it('deve retornar false se não tiver dados para um dos poderes');

  });

  describe('#calcula', function() {

    it('deve retornar retornar de acordo com os pesos dos poderes');

    it('deve retornar índices que somam 1 no ano');

  });

});

describe('ipl.IndiceTodosOsNiveis', function() {

  describe('#anos', function() {

    it('deve retornar anos com eleição em algum dos níveis');

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram em um dos níveis');

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para todos os níveis');

    it('deve retornar false se não tiver dados para um dos níveis');

  });

  describe('#calcula', function() {

    it('deve retornar a média de todos os níveis');

    it('deve retornar índices que somam 1 no ano');

  });

});
