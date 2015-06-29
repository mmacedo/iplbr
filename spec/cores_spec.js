describe("GerenciadorDeCores", function() {

  var partidos = {
    A: { sigla: 'A', numero: 1, fundado: 1979, cor: null },
    B: { sigla: 'B', numero: 2, fundado: 1979, cor: null },
    C: { sigla: 'C', numero: 3, fundado: 1979, cor: null },
  };

  it("deveria retornar uma cor da paleta", function() {

    var partido = _.assign(partidos.A, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');

  });

  it("deveria retornar a segunda cor da paleta", function() {

    var partido1 = _.assign(partidos.A, { cor: 'vermelho' });
    var partido2 = _.assign(partidos.B, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido1)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido2)).toEqual('tomato');

  });

  it("deveria reiterar quando completar a paleta", function() {

    var partido1 = _.assign(partidos.A, { cor: 'vermelho' });
    var partido2 = _.assign(partidos.B, { cor: 'vermelho' });
    var partido3 = _.assign(partidos.C, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido1)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido2)).toEqual('tomato');
    expect(gerenciadorDeCores.cor(partido3)).toEqual('crimson');

  });

  it("deveria retornar a mesma cor para o mesmo partido", function() {

    var partido = _.assign(partidos.A, { cor: 'vermelho' });

    var paleta = { 'vermelho': [ 'crimson', 'tomato' ] };
    var gerenciadorDeCores = new GerenciadorDeCores(paleta);

    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');
    expect(gerenciadorDeCores.cor(partido)).toEqual('crimson');

  });

});
