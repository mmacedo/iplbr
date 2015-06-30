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

### Estrutura

A ideia é manter uma estrutura minimalista. Todos os arquivos dentro da pasta `public` são servidos de forma estática e sem pré-processamento.

- `public/index.html`: Única página com todo HTML. Deve ser responsiva;
- `public/eleitos.json`: Ver **Carga de dados**;
- `public/favicons`: O ícone é o [escudo de armas do Brasil](https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Brazil.svg), gerado utilizando [gerador de favicon](http://realfavicongenerator.net/);
- `public/css/index.css`: Contém o CSS da página;
- `public/js/app/index.js`: Contém o Javascript da página;
- `public/js/app/configuracao.js`: Contém a lógica de configuração dos índices;
- `public/js/app/indice.js`: Contém a lógica de cálculo dos índices;
- `public/js/app/serie.js`: Contém a lógica de geração das séries para os gráficos.

### Dependências

Última versão do [Twitter Boostrap](http://getbootstrap.com/) com tema [Journal](https://bootswatch.com/journal/):

- `public/css/bootstrap.min.css` (tema)
- `pulic/js/bootstrap/boostrap.min.js`
- `pulic/js/bootstrap/ie10-viewport-bug-workaround.js` (http://getbootstrap.com/assets/js/ie10-viewport-bug-workaround.js)
- `public/fonts` ([Glyphicon](http://getbootstrap.com/components/#glyphicons))

Última versão não paga do [Highcharts](http://www.highcharts.com/) com os seguintes arquivos:

- `public/js/highcharts/highcharts.js`
- `public/js/highcharts/exporting.js` (módulo de exportação)
- `public/js/highcharts/no-data-to-display.js` (módulo para mostrar texto quando não há dados)
- `public/js/highcharts/grid-light.js` (tema Grid Light)

Últimas versões de [jQuery](https://jquery.com/) e [Lo-Dash](https://lodash.com/), com suporte para IE 8.

### Lint

Código-fonte verificado com [bootlint](https://github.com/twbs/bootlint) e [jshint](http://jshint.com/) (ver `.jshintrc` e `spec/.jshintrc`):

1. Instale os linters com `npm install -g bootlint jshint`.
2. Execute `./verifica.sh` para rodar os linters nos arquivos relevantes.

### Testes

Testado com a última versão de [Jasmine](http://jasmine.github.io/) instalado via [gem](https://github.com/jasmine/jasmine-gem):

1. Instale o site com `bundle install`.
2. Rode os testes com `rake jasmine:ci`.

### Desenvolvimento

Servido localmente com as últimas versões de [MRI (Ruby)](https://www.ruby-lang.org/) e [rack](https://rack.github.io/) (ver `Gemfile` e `config.ru`):

1. Instale o site com `bundle install`.
2. Rode o servidor com `bundle exec rackup`.
3. Acesse a página em `http://localhost:9292`.

### Produção

Para criar o branch `gh-pages` no github, execute o seguinte no bash dentro do diretório raiz do projeto:

    REPO=git@github.com:mmacedo/iplbr.git

    git clone $REPO _deploy
    pushd _deploy
    git checkout --orphan gh-pages
    git rm -r --cached .
    git clean -df
    cp -r ../public/* .
    git add -A
    git commit -m "Initial commit"
    git push origin gh-pages --set-upstream
    popd

Para publicar, guarde as alterações não comitadas no stash e execute `./publish_to_github.sh`.

## Extra

Execute `./conta_linhas.sh` para enumerar todos os arquivos mantidos manualmente com contagem de linhas e caracteres (ver `wc`).
