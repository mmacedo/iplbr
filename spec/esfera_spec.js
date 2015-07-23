'use strict';

describe('ipl.EsferaFederal', function() {

  beforeEach(function() {
    this.esfera = new ipl.EsferaFederal();
  });

  describe('#uesComDados', function() {

    it('deve retornar BR', function() {
      var resultado = this.esfera.uesComDados();
      expect(resultado).to.eql([ 'BR' ]);
    });

  });

  describe('#todasAsUes', function() {

    it('deve retornar BR', function() {
      var resultado = this.esfera.todasAsUes();
      expect(resultado).to.eql([ 'BR' ]);
    });

  });

});

beforeEach(function() {
  this.sul = [ 'PR', 'RS', 'SC' ];
  this.centroOesteComDf = [ 'DF', 'GO', 'MS', 'MT' ];
  this.centroOesteSemDf = [ 'GO', 'MS', 'MT' ];
});

describe('ipl.EsferaEstadual', function() {

  beforeEach(function() {
    this.esfera = new ipl.EsferaEstadual();
  });

  describe('#uesComDados', function() {

    it('deve retornar todos os estados', function() {
      var resultado = this.esfera.uesComDados({ ues: this.sul.slice() });
      expect(resultado).to.eql(this.sul);
    });

    it('não deve incluir o distrito federal', function() {
      var resultado = this.esfera.uesComDados({ ues: this.centroOesteComDf });
      expect(resultado).to.eql(this.centroOesteSemDf);
    });

    it('deve retornar vazio se não tiver nenhum estado', function() {
      var resultado = this.esfera.uesComDados({ ues: [ 'DF' ] });
      expect(resultado).to.eql([]);
    });

  });

  describe('#todasAsUes', function() {

    it('deve retornar todos os estados', function() {
      var resultado = this.esfera.todasAsUes({ ues: this.sul.slice() });
      expect(resultado).to.eql(this.sul);
    });

    it('deve incluir o distrito federal', function() {
      var resultado = this.esfera.todasAsUes({ ues: this.centroOesteComDf.slice() });
      expect(resultado).to.eql(this.centroOesteComDf);
    });

  });

});

describe('ipl.EsferaDistrital', function() {

  beforeEach(function() {
    this.esfera = new ipl.EsferaDistrital();
  });

  describe('#uesComDados', function() {

    it('deve retornar o distrito federal', function() {
      var resultado = this.esfera.uesComDados({ ues: [ 'DF' ] });
      expect(resultado).to.eql([ 'DF' ]);
    });

    it('não deve incluir os estados', function() {
      var resultado = this.esfera.uesComDados({ ues: this.centroOesteComDf });
      expect(resultado).to.eql([ 'DF' ]);
    });

    it('deve retornar vazio se não tiver o distrito federal', function() {
      var resultado = this.esfera.uesComDados({ ues: this.sul });
      expect(resultado).to.eql([]);
    });

  });

  describe('#todasAsUes', function() {

    it('deve retornar o distrito federal', function() {
      var resultado = this.esfera.todasAsUes({ ues: [ 'DF' ] });
      expect(resultado).to.eql([ 'DF' ]);
    });

    it('deve incluir os estados', function() {
      var resultado = this.esfera.todasAsUes({ ues: this.centroOesteComDf.slice() });
      expect(resultado).to.eql(this.centroOesteComDf);
    });

  });

});

describe('ipl.EsferaMunicipal', function() {

  beforeEach(function() {
    this.esfera = new ipl.EsferaMunicipal();
  });

  describe('#uesComDados', function() {

    it('deve retornar todos os estados', function() {
      var resultado = this.esfera.uesComDados({ ues: this.sul.slice() });
      expect(resultado).to.eql(this.sul);
    });

    it('não deve incluir o distrito federal', function() {
      var resultado = this.esfera.uesComDados({ ues: this.centroOesteComDf });
      expect(resultado).to.eql(this.centroOesteSemDf);
    });

    it('deve retornar vazio se não tiver nenhuma UF com eleição municipal', function() {
      var resultado = this.esfera.uesComDados({ ues: [ 'DF' ] });
      expect(resultado).to.eql([]);
    });

  });

  describe('#todasAsUes', function() {

    it('deve retornar todos os estados', function() {
      var resultado = this.esfera.todasAsUes({ ues: this.sul.slice() });
      expect(resultado).to.eql(this.sul);
    });

    it('deve incluir o distrito federal', function() {
      var resultado = this.esfera.todasAsUes({ ues: this.centroOesteComDf.slice() });
      expect(resultado).to.eql(this.centroOesteComDf);
    });

  });

});
