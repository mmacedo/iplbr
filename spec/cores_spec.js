"use strict";

describe("GerenciadorDeCores", function() {

  beforeAll(function() {
    this.a = { sigla: 'A', numero: 1, fundado: 1979, cor: null };
    this.b = { sigla: 'B', numero: 2, fundado: 1979, cor: null };
    this.c = { sigla: 'C', numero: 3, fundado: 1979, cor: null };
  });

  it("deve retornar uma cor da paleta", function() {

    var partido = _.assign(this.a, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');

  });

  it("deve retornar a segunda cor da paleta", function() {

    var partido1 = _.assign(this.a, { cor: 'vermelho' });
    var partido2 = _.assign(this.b, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido1)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido2)).toEqual('tomato');

  });

  it("deve reiterar quando completar a paleta", function() {

    var partido1 = _.assign(this.a, { cor: 'vermelho' });
    var partido2 = _.assign(this.b, { cor: 'vermelho' });
    var partido3 = _.assign(this.c, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido1)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido2)).toEqual('tomato');
    expect(gerenciadorDeCores.cor(partido3)).toEqual('crimson');

  });

  it("deve retornar a mesma cor para o mesmo partido", function() {

    var partido = _.assign(this.a, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');

  });

  it("deve retornar a mesma cor para partido renomeado", function() {

    var partido1 = _.assign(this.a, { cor: 'vermelho', fundado: 1979, extinto: 1980, renomeado: 'B' });
    var partido2 = _.assign(this.b, { cor: 'vermelho', fundado: 1980, extinto: 1981, renomeado: 'C' });
    var partido3 = _.assign(this.c, { cor: 'vermelho', fundado: 1981 });
    Configuracao.partidos = [ partido1, partido2, partido3 ];

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido1)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido2)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido3)).toEqual('crimson');

  });


});
