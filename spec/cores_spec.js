/* globals _, GerenciadorDeCores, Configuracao */

'use strict';

describe('GerenciadorDeCores', function() {

  beforeAll(function() {
    this.a = { sigla: 'A', numero: 1, fundado: 1979, cor: 'vermelho' };
    this.b = { sigla: 'B', numero: 2, fundado: 1979, cor: 'vermelho' };
    this.c = { sigla: 'C', numero: 3, fundado: 1979, cor: 'vermelho' };

    this.tom1 = 'crimson';
    this.tom2 = 'tomato';

    this.paletaComUmTom    = { vermelho: [ this.tom1 ] };
    this.paletaComDoisTons = { vermelho: [ this.tom1, this.tom2 ] };
  });

  it('deve retornar uma cor da paleta', function() {
    var partido = this.a;
    var g = new GerenciadorDeCores(this.paletaComUmTom);
    expect(g.cor(partido)).toEqual(this.tom1);
  });

  it('deve retornar a segunda cor da paleta', function() {
    var partido1 = this.a, partido2 = this.b;
    var g = new GerenciadorDeCores(this.paletaComDoisTons);
    expect(g.cor(partido1)).toEqual(this.tom1);
    expect(g.cor(partido2)).toEqual(this.tom2);
  });

  it('deve reiterar quando completar a paleta', function() {
    var partido1 = this.a, partido2 = this.b, partido3 = this.c;
    var g = new GerenciadorDeCores(this.paletaComDoisTons);
    expect(g.cor(partido1)).toEqual(this.tom1);
    expect(g.cor(partido2)).toEqual(this.tom2);
    expect(g.cor(partido3)).toEqual(this.tom1);
  });

  it('deve retornar a mesma cor para o mesmo partido', function() {
    var partido = this.a;
    var g = new GerenciadorDeCores(this.paletaComDoisTons);
    expect(g.cor(partido)).toEqual(this.tom1);
    expect(g.cor(partido)).toEqual(this.tom1);
  });

  it('deve retornar a mesma cor para partido renomeado', function() {
    var partido1 = _.assign({}, this.a, { fundado: 1979, extinto: 1980, renomeado: 'B' });
    var partido2 = _.assign({}, this.b, { fundado: 1980, extinto: 1981, renomeado: 'C' });
    var partido3 = _.assign({}, this.c, { fundado: 1981 });
    Configuracao.partidos = [ partido1, partido2, partido3 ];
    var g = new GerenciadorDeCores(this.paletaComDoisTons);
    expect(g.cor(partido1)).toEqual(this.tom1);
    expect(g.cor(partido2)).toEqual(this.tom1);
    expect(g.cor(partido3)).toEqual(this.tom1);
  });

});
