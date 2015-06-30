/* global _, Configuracao */

'use strict';

describe("Configuracao - métodos estáticos", function() {

  describe(".encontraPartidoSucessor", function() {

    it("deve retornar sucessor se foi incorporado", function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      Configuracao.partidos = [ a, b ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b);
    });

    it("não deve retornar sucessor com mesma sigla, mas fundado após a incorporação", function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_apos  = { sigla: 'B', numero: 21, fundado: 2014 };
      var b_antes = { sigla: 'B', numero: 22, fundado: 1979 };
      Configuracao.partidos = [ a, b_apos, b_antes ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b_antes);
    });

    it("deve retornar sucessor se foi renomeado", function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      Configuracao.partidos = [ a, b ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b);
    });

    it("não deve retornar sucessor com mesma sigla, mas fundado antes da mudança de nome", function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, renomeado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      Configuracao.partidos = [ a, b_antes, b_apos ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b_apos);
    });

    it("deve retornar sucessor se foi fundido", function() {
      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 2012 };
      Configuracao.partidos = [ a, b ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b);
    });

    it("não deve retornar sucessor com mesma sigla, mas fundado antes da fusão", function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, fusao: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 2012 };
      Configuracao.partidos = [ a, b_antes, b_apos ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b_apos);
    });

    it("não deve retornar sucessor com mesma sigla, mas extinto antes do predecessor", function() {
      var a       = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b_antes = { sigla: 'B', numero: 21, fundado: 1979, extinto: 2010 };
      var b_apos  = { sigla: 'B', numero: 22, fundado: 1979, extinto: 2014 };
      Configuracao.partidos = [ a, b_antes, b_apos ];

      var resultado = Configuracao.encontraPartidoSucessor(a);

      expect(resultado).toBe(b_apos);
    });

  });

});

describe("Configuracao", function() {
  beforeEach(function() {
    this.configuracao = new Configuracao();
  });

  describe("#mesclarPartidosExtintos", function() {

    function geraInput(partido, indices) {
      return { sigla: partido.sigla, numero: partido.numero, info: partido, indices: indices || [] };
    }

    function geraOutputInalterado(input) {
      return _.assign(input, {
        fundado:   input.info.fundado,
        extinto:   input.info.extinto,
        mesclados: [],
        indices:   input.indices
      });
    }

    it("deve retornar inalterado se não tem sucessor", function() {
      _.set(this.configuracao, { mudancasDeNome: true, incorporacoes: true, fusoes: true });

      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012 };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      Configuracao.partidos = [ a, b ];

      var dados = [ geraInput(a), geraInput(b) ];

      var resultado = this.configuracao.mesclarPartidosExtintos(dados);

      var esperado = [ geraOutputInalterado(dados[0]), geraOutputInalterado(dados[1]) ];

      expect(resultado).toEqualIgnoringNulls(esperado);
    });

    it("deve mesclar se estiver configurado para mesclar", function() {
      this.configuracao.incorporacoes = true;

      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      Configuracao.partidos = [ a, b ];

      var dados = [ geraInput(a), geraInput(b) ];

      spyOn(Configuracao, 'encontraPartidoSucessor').and.callThrough();
      var resultado = this.configuracao.mesclarPartidosExtintos(dados);

      expect(resultado.length).toEqual(1);
      expect(_.find(resultado, _.pick(a, [ 'sigla', 'numero' ]))).toBeFalsy();
      expect(Configuracao.encontraPartidoSucessor).toHaveBeenCalled();
    });

    it("não deve mesclar se não estiver configurado para mesclar", function() {
      this.configuracao.incorporacoes = false;

      var a = { sigla: 'A', numero: 1, fundado: 1979, extinto: 2012, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979 };
      Configuracao.partidos = [ a, b ];

      var dados = [ geraInput(a), geraInput(b) ];

      var resultado = this.configuracao.mesclarPartidosExtintos(dados);

      expect(resultado.length).toEqual(2);
      expect(_.find(resultado, _.pick(a, [ 'sigla', 'numero' ]))).toBeTruthy();
    });

    it("deve manter a data de fundação do mais antigo e data de extinção do último", function() {
      _.set(this.configuracao, { mudancasDeNome: true, incorporacoes: true, fusoes: true });

      var a = { sigla: 'A', numero: 1, fundado: 1980, extinto: 1981, incorporado: 'B' };
      var b = { sigla: 'B', numero: 2, fundado: 1979, extinto: 1982, fusao: 'D' };
      var c = { sigla: 'C', numero: 3, fundado: 1981, extinto: 1982, fusao: 'D' };
      var d = { sigla: 'D', numero: 4, fundado: 1982, extinto: 1983, renomeado: 'E' };
      var e = { sigla: 'E', numero: 5, fundado: 1983, extinto: 1984 };
      Configuracao.partidos = [ a, b, c, d, e ];

      var dados = [ geraInput(a), geraInput(b), geraInput(c), geraInput(d), geraInput(e) ];

      var resultado = this.configuracao.mesclarPartidosExtintos(dados);

      expect(resultado.length).toEqual(1);
      expect(resultado[0].fundado).toEqual(1979);
      expect(resultado[0].extinto).toEqual(1984);
    });

    it("deve somar os índices", function() {
      _.set(this.configuracao, { incorporacoes: true, fusoes: true });

      var a = { sigla: 'A', numero: 1, fundado: 2002, extinto: 2006, fusao: 'C' };
      var b = { sigla: 'B', numero: 2, fundado: 2006, extinto: 2006, fusao: 'C' };
      var c = { sigla: 'C', numero: 3, fundado: 2006, extinto: 2010, incorporado: 'D' };
      var d = { sigla: 'D', numero: 4, fundado: 2006, extinto: 2014 };
      Configuracao.partidos = [ a, b, c, d ];

      var dados = [
        geraInput(a, [ { ano: 2002, indice: 1 }, { ano: 2006, indice: 1 } ]),
        geraInput(b, [                           { ano: 2006, indice: 2 } ]),
        geraInput(c, [                                                     { ano: 2010, indice: 1 } ]),
        geraInput(d, [                           { ano: 2006, indice: 4 }, { ano: 2010, indice: 2 }, { ano: 2014, indice: 1 } ])
      ];

      var esperado = [ { ano: 2002, indice: 1 }, { ano: 2006, indice: 7 }, { ano: 2010, indice: 3 }, { ano: 2014, indice: 1 } ];

      var resultado = this.configuracao.mesclarPartidosExtintos(dados);

      expect(resultado.length).toEqual(1);
      expect(resultado[0].indices).toEqual(esperado);
    });

  });


});
