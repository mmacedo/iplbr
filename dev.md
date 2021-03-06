# Desenvolvimento

## Carga de dados

Essa informação é para manutenção da carga de dados apenas, todos os arquivos importados e gerados estão versionados.

### Importar lista de eleitos

Para importar eleitos (1998-2014):

1. Siga as instruções em `carga/tse.md` para adquirir os arquivos necessários do TSE (~0.5GB de download e mais 6GB de espaço para extrair).
2. Execute `carga/importa_eleitos.rb` para gerar listas de eleitos em `carga/eleitos` (20MB de espaço, 1h de processamento).

Os dados são insuficientes para as eleições municipais e para anos anteriores. É necessário buscar outras formas de importar os dados do TSE, ver `carga/importa_eleitos_jquery.md` e `carga/importa_eleitos_importados.rb`.

### Importar lista de partidos

O arquivo `carga/partidos.txt` é acrescido pelos scripts de carga com os partidos atuantes cada ano com sigla, número e nome conforme disponível. Para identificar possíveis problemas de identificação dos partidos execute `carga/analisa_partidos.rb` após a carga de dados.

### Importar estimativas de população

Para importar as estimativas de população por município (1992-2014):

1. Siga as instruções em em `carga/ibge.md` para adquirir os arquivos necessários do IBGE (4MB depois de convertido para OpenDocument).
2. Execute `carga/importa_populacao.rb` para gerar a lista de estimativas de população em `carga/populacao` (2MB).

### Gerar arquivo JSON

A fonte de dados principal da aplicação é um arquivo JSON contendo uma série de totais gerados para o cálculo dos índices com base nas listas importadas. Siga os seguintes passos:

1. Realize a carga de eleitos.
2. Realize a carga de estimativas de população.
3. Execute `carga/gera_json.rb` para gerar os totais em `public/eleitos.json`.

## Website

[![Build Status](https://travis-ci.org/mmacedo/iplbr.svg)](https://travis-ci.org/mmacedo/iplbr)
[![Build status](https://ci.appveyor.com/api/projects/status/xet1aa2gcyhsed51?svg=true)](https://ci.appveyor.com/project/mmacedo/iplbr)
[![Coverage](https://img.shields.io/codecov/c/github/mmacedo/iplbr.svg?style=flat-square)](https://codecov.io/github/mmacedo/iplbr?branch=master)
[![Coverage Status](https://coveralls.io/repos/mmacedo/iplbr/badge.svg?branch=master&service=github)](https://coveralls.io/github/mmacedo/iplbr?branch=master)
[![devDependency Status](https://david-dm.org/mmacedo/iplbr/dev-status.svg)](https://david-dm.org/mmacedo/iplbr#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/mmacedo/iplbr/badges/gpa.svg)](https://codeclimate.com/github/mmacedo/iplbr)

### Estrutura

A ideia é manter uma estrutura minimalista. Todos os arquivos dentro da pasta `public` são servidos de forma estática e sem pré-processamento.

- `public/index.html`: Única página com todo HTML. Deve ser responsiva;
- `public/eleitos.json`: Ver **Carga de dados**;
- `public/favicons`: O ícone é o [escudo de armas do Brasil](https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Brazil.svg), gerado utilizando [gerador de favicon](http://realfavicongenerator.net/);
- `public/js/app/ipl.js`: Cria o namespace para o resto dos arquivos;
- `public/js/app/eleicao.js`: Lógica de leitura do json;
- `public/js/app/indice.js`: Fábrica de índices.
- `public/js/app/cargo.js`: Índices por cargo.
- `public/js/app/composto.js`: Índices complexos compostos de outros índices.
- `public/js/app/partido.js`: Lógica de busca dos partidos;
- `public/js/app/configuracao.js`: Lógica de configuração dos partidos;
- `public/js/app/serie.js`: Geração das séries para os gráficos;
- `public/js/app/grafico.js`: Geração dos gráficos;
- `public/js/app/main.js`: Lógica da página.

### Dependências

Última versão do [Twitter Boostrap](http://getbootstrap.com/) com tema [Journal](https://bootswatch.com/journal/):

- `public/css/bootstrap.min.css` (tema)
- `pulic/js/boostrap.min.js`
- `pulic/js/ie10-viewport-bug-workaround.js` (http://getbootstrap.com/assets/js/ie10-viewport-bug-workaround.js)
- `public/fonts` ([Glyphicon](http://getbootstrap.com/components/#glyphicons))

Última versão não paga do [Highcharts](http://www.highcharts.com/) com os seguintes arquivos:

- `public/js/highcharts/highcharts.js`
- `public/js/highcharts/exporting.js` (módulo de exportação)
- `public/js/highcharts/no-data-to-display.js` (módulo para mostrar texto quando não há dados)
- `public/js/highcharts/grid-light.js` (tema Grid Light)

Últimas versões sem suporte para IE 8 de [jQuery](https://jquery.com/) (2.x) e [Lo-Dash](https://lodash.com/) (modern). Última versão de [big.js](http://mikemcl.github.io/big.js/).

### Desenvolvimento

Todas as tarefas são realizadas com [Node.js](https://nodejs.org/) e [Grunt](http://gruntjs.com/) (ver `Gruntfile.js`). Para preparar o ambiente realize as seguinte:

1. Instale o Node.js mais recente.
1. Instale o comando `grunt` com `npm install -g grunt-cli`.
2. Instale os módulos [npm](https://www.npmjs.com/) (ver `package.json`) com `npm install`.

#### Verificadores

O seguintes verificadores são utilizados no código HTML:

- Código HTML validado com [v.Nu](https://validator.github.io/validator/) (requer Java >=6 instalado);
- Código HTML com Bootstrap analisado com [Bootlint](https://github.com/twbs/bootlint).

Para rodar todos os verificadores execute:

```
grunt check-html
```

Os seguintes verificados são utilizados no código JavaScript:

- Código JavaScript analisado com [JSHint](http://jshint.com/) (ver `.jshintrc` e `spec/.jshintrc`);
- Estilo do código JavaScript verificado com [JSCS](http://jscs.info/) (ver `.jscsrc`).

Para rodar todos os verificadores execute:

```
grunt check-js
```

#### Testes

As seguintes bibliotecas são utilizadas para testar o código JavaScript:

- Biblioteca de testes: [Mocha](http://mochajs.org/);
- Biblioteca de asserção: [Chai](http://chaijs.com/);
- Biblioteca de test doubles: [Sinon.JS](http://sinonjs.org/);
- Executor de testes: [Karma](http://karma-runner.github.io/);
- Relatório de cobertura de código: [Istanbul](https://github.com/gotwarlost/istanbul).

Para rodar todos os testadores execute:

```
grunt test
```

Para servir uma página de testes localmente na porta 8989 usando [Karma](http://karma-runner.github.io/):

```
grunt runner
```

#### Servidor

Para servir a aplicação localmente localmente na porta 9393 usando [Connect](https://github.com/senchalabs/connect) e [LiveReload](http://livereload.com/):

```
grunt server
```

### Produção

Para criar o branch `gh-pages` no github, execute o seguinte no bash dentro do diretório raiz do projeto:

    REPO=git@github.com:mmacedo/iplbr.git

    git clone $REPO tmp/deploy
    pushd tmp/deploy
    git checkout --orphan gh-pages
    git rm -r --cached .
    git clean -df
    cp -r ../../public/* .
    git add -A
    git commit -m "Initial commit"
    git push origin gh-pages --set-upstream
    popd

Para publicar, guarde as alterações não comitadas no stash e execute `./deploy_no_github.sh`.

## Extra

Execute `./conta_linhas.sh` para enumerar todos os arquivos mantidos manualmente com contagem de linhas e caracteres (ver `wc`).
