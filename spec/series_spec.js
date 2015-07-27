'use strict';

describe('ipl.GeradorDeSeries', function() {

  describe('#geraIndices', function() {

    it('deve retornar as propriedades adequadas');

    it('deve retornar os índices para todos os partidos');

    it('deve retornar os índices para todos os anos');

  });

  describe('#filtraAnos', function() {

    it('deve manter anos que o partido existe');

    it('deve remover anos antes de ser fundado se manterNulos=false');

    it('deve manter anos antes de ser fundado como nulos se manterNulos=true');

    it('deve remover anos após ser extinto se manterNulos=false');

    it('não deve remover anos após ser extinto se manterNulos=true');

  });

  describe('#filtraPartidos', function() {

    it('deve retornar inalterado se o partido tiver índice');

    it('deve remover partidos que não tem índices');

  });

  describe('#formataParaLinhasOuAreasHighcharts', function() {

    describe('(séries)', function() {

      it('deve retornar séries no formato esperado para gráfico de linha');

      it('deve retornar informações adicionais na série');

      it('deve retornar séries ordenadas pela soma dos índices (descendente)');

      it('não deve somar índices do ano extra adicionado para gráfico em passos');

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha');

      it('deve retornar datas do ano após o ano da eleição');

      it('deve retornar pontos ordenados pela data');

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série');

      it('deve retornar a mesma cor para o mesmo partido independente da ordem');

      it('deve retornar linha preta se a série for resto');

      it('deve retornar linha tracejada se a série for resto');

    });

  });

  describe('#formataParaTortaHighcharts', function() {

    describe('(série)', function() {

      it('deve retornar série no formato esperado para gráfico de torta');

    });

    describe('(pontos)', function() {

      it('deve retornar pontos no formato esperado para gráfico de linha');

      it('deve retornar pontos ordenados pelo índice (descendente)');

    });

    describe('(aparência)', function() {

      it('deve chamar GerenciadorDeCores para achar a cor da série');

      it('deve retornar a mesma cor para o mesmo partido independente da ordem');

      it('deve retornar fatia preta se a série for resto');

    });

  });

  describe('#seriesPorRegiao', function() {

    it('deve retornar apenas anos que tem dados');

    it('deve adicionar ano extra no final para gráfico em passos');

    it('deve filtrar índice pela região');

    it('deve retornar lista vazia se não tiver dados');

    it('deve chamar configuração de partidos');

    it('deve chamar formataParaLinhasOuAreasHighcharts');

  });

  describe('#seriesPorAno', function() {

    it('deve filtrar índice pela região');

    it('deve calcular índice com o ano da eleição');

    it('deve retornar série vazia se não tiver dados');

    it('deve chamar configuração de partidos');

    it('deve chamar formataParaTortaHighcharts');

  });

});
