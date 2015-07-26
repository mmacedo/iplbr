'use strict';

describe('ipl.IndiceBicameral', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos com eleição em qualquer das casas', function() {
      var camara = { eleicoes: function() { return [ 2010 ]; } };
      var senado = { eleicoes: function() { return [ 2014 ]; } };
      var indice = new ipl.IndiceBicameral(camara, senado);
      expect(indice.eleicoes()).to.eql([ 2010, 2014 ]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram em qualquer das casas', function() {
      var camara = { partidos: function() { return [ 'a1' ]; } };
      var senado = { partidos: function() { return [ 'a2' ]; } };
      var indice = new ipl.IndiceBicameral(camara, senado);
      expect(indice.partidos()).to.eql([ 'a1', 'a2' ]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para as duas casas', function() {
      var camara = { temDados: function() { return true; } };
      var senado = { temDados: function() { return true; } };
      var indice = new ipl.IndiceBicameral(camara, senado);
      expect(indice.temDados()).to.be.true();
    });

    it('deve retornar false se não tiver dados para pelo menos uma das casas', function() {
      var temDadosCamara = false, temDadosSenado = false;
      var camara = { temDados: function() { return temDadosCamara; } };
      var senado = { temDados: function() { return temDadosSenado; } };
      var indice = new ipl.IndiceBicameral(camara, senado);
      expect(indice.temDados()).to.be.false();
      temDadosCamara = true; temDadosSenado = false;
      expect(indice.temDados()).to.be.false();
      temDadosCamara = false; temDadosSenado = true;
      expect(indice.temDados()).to.be.false();
    });

  });

  describe('#calcula', function() {

    it('deve retornar a média das duas casas', function() {
      var camara = { calcula: function() { return 10; } };
      var senado = { calcula: function() { return 20; } };
      var indice = new ipl.IndiceBicameral(camara, senado);
      expect(indice.calcula()).to.equal(15);
    });

  });

});

describe('ipl.IndiceSomaDf', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos com eleição nos estados ou no DF', function() {
      var estados = { eleicoes: function() { return [ 2010 ]; } };
      var df      = { eleicoes: function() { return [ 2014 ]; } };
      var indice  = new ipl.IndiceSomaDf(estados, df);
      expect(indice.eleicoes()).to.eql([ 2010, 2014 ]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram nos estados ou no DF', function() {
      var estados = { partidos: function() { return [ 'a1' ]; } };
      var df      = { partidos: function() { return [ 'a2' ]; } };
      var indice  = new ipl.IndiceSomaDf(estados, df);
      expect(indice.partidos()).to.eql([ 'a1', 'a2' ]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para os estados e para o DF', function() {
      var estados = { temDados: function() { return true; } };
      var df      = { temDados: function() { return true; } };
      var indice  = new ipl.IndiceSomaDf(estados, df);
      expect(indice.temDados()).to.be.true();
    });

    it('deve retornar false se não tiver nos estados ou no DF', function() {
      var temDadosEstados = false, temDadosDf = false;
      var estados = { temDados: function() { return temDadosEstados; } };
      var df      = { temDados: function() { return temDadosDf; } };
      var indice  = new ipl.IndiceSomaDf(estados, df);
      expect(indice.temDados()).to.be.false();
      temDadosEstados = true; temDadosDf = false;
      expect(indice.temDados()).to.be.false();
      temDadosEstados = false; temDadosDf = true;
      expect(indice.temDados()).to.be.false();
    });

  });

  describe('#calcula', function() {

    it('deve retornar a soma dos índices de dos estados e do DF', function() {
      var estados = { calcula: function() { return 9; } };
      var df      = { calcula: function() { return 1; } };
      var indice  = new ipl.IndiceSomaDf(estados, df);
      expect(indice.calcula()).to.equal(10);
    });

  });

});

describe('ipl.IndiceEsfera', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos com eleição no legislativo ou no executivo', function() {
      var legislativo = { eleicoes: function() { return [ 2010 ]; } };
      var executivo   = { eleicoes: function() { return [ 2014 ]; } };
      var indice      = new ipl.IndiceEsfera(legislativo, executivo);
      expect(indice.eleicoes()).to.eql([ 2010, 2014 ]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram no legislativo ou no executivo', function() {
      var legislativo = { partidos: function() { return [ 'a1' ]; } };
      var executivo   = { partidos: function() { return [ 'a2' ]; } };
      var indice      = new ipl.IndiceEsfera(legislativo, executivo);
      expect(indice.partidos()).to.eql([ 'a1', 'a2' ]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para os dois poderes', function() {
      var legislativo = { temDados: function() { return true; } };
      var executivo   = { temDados: function() { return true; } };
      var indice      = new ipl.IndiceEsfera(legislativo, executivo);
      expect(indice.temDados()).to.be.true();
    });

    it('deve retornar false se não tiver dados para um dos poderes', function() {
      var temDadosLegislativo = false, temDadosExecutivo = false;
      var legislativo = { temDados: function() { return temDadosLegislativo; } };
      var executivo   = { temDados: function() { return temDadosExecutivo; } };
      var indice      = new ipl.IndiceEsfera(legislativo, executivo);
      expect(indice.temDados()).to.be.false();
      temDadosLegislativo = true; temDadosExecutivo = false;
      expect(indice.temDados()).to.be.false();
      temDadosLegislativo = false; temDadosExecutivo = true;
      expect(indice.temDados()).to.be.false();
    });

  });

  describe('#calcula', function() {

    it('deve retornar retornar de acordo com os pesos dos poderes', function() {
      var legislativo = { calcula: function() { return 10; } };
      var executivo   = { calcula: function() { return 20; } };
      var indice      = new ipl.IndiceEsfera(legislativo, executivo);
      _.assign(indice, { pesoDoLegislativo: 0, pesoDoExecutivo: 1 });
      expect(indice.calcula()).to.equal(20);
      _.assign(indice, { pesoDoLegislativo: 1, pesoDoExecutivo: 0 });
      expect(indice.calcula()).to.equal(10);
    });

  });

});

describe('ipl.IndiceTodosOsNiveis', function() {

  describe('#eleicoes', function() {

    it('deve retornar anos com eleição em algum dos níveis', function() {
      var federal   = { eleicoes: function() { return [ 2006 ]; } };
      var estadual  = { eleicoes: function() { return [ 2010 ]; } };
      var municipal = { eleicoes: function() { return [ 2014 ]; } };
      var indice    = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
      expect(indice.eleicoes()).to.eql([ 2006, 2010, 2014 ]);
    });

  });

  describe('#partidos', function() {

    it('deve retornar partidos que elegeram em um dos níveis', function() {
      var federal   = { partidos: function() { return [ 'a1' ]; } };
      var estadual  = { partidos: function() { return [ 'a2' ]; } };
      var municipal = { partidos: function() { return [ 'a3' ]; } };
      var indice    = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
      expect(indice.partidos()).to.eql([ 'a1', 'a2', 'a3' ]);
    });

  });

  describe('#temDados', function() {

    it('deve retornar true se tiver dados para todos os níveis', function() {
      var federal   = { temDados: function() { return true; } };
      var estadual  = { temDados: function() { return true; } };
      var municipal = { temDados: function() { return true; } };
      var indice    = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
      expect(indice.temDados()).to.be.true();
    });

    it('deve retornar false se não tiver dados para um dos níveis', function() {
      var temDadosFederal = false, temDadosEstadual = false, temDadosMunicipal = false;
      var federal   = { temDados: function() { return temDadosFederal; } };
      var estadual  = { temDados: function() { return temDadosEstadual; } };
      var municipal = { temDados: function() { return temDadosMunicipal; } };
      var indice    = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
      expect(indice.temDados()).to.be.false();
      temDadosFederal = false; temDadosEstadual = true; temDadosMunicipal = true;
      expect(indice.temDados()).to.be.false();
      temDadosFederal = true; temDadosEstadual = false; temDadosMunicipal = true;
      expect(indice.temDados()).to.be.false();
      temDadosFederal = true; temDadosEstadual = true; temDadosMunicipal = false;
      expect(indice.temDados()).to.be.false();
    });

  });

  describe('#calcula', function() {

    it('deve retornar a média de todos os níveis', function() {
      var federal   = { calcula: function() { return 10; } };
      var estadual  = { calcula: function() { return 15; } };
      var municipal = { calcula: function() { return 20; } };
      var indice    = new ipl.IndiceTodosOsNiveis(federal, estadual, municipal);
      expect(indice.calcula()).to.equal(15);
    });

  });

});
