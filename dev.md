# Desenvolvimento

## Carga de dados

1. Siga as instruções em `carga/resultados_no_tse.md` para adquirir os arquivos necessários do TSE (~0.5GB de download e mais 6GB de espaço para extrair).
2. Execute `carga/importa_eleitos.rb` para gerar listas de eleitos em `carga/eleitos` (20MB de espaço, 1h de processamento).
3. (opcional) Complete manualmente as listas de eleitos, os dados do TSE são bastante faltosos.
4. Execute `carga/gera_json.rb` para gerar um JSON com totais de eleitos em `public/eleitos.json`.

## Website

### Estrutura

A ideia é ser minimalista.

#### public/index.html

Única página com todo HTML, Javascript e CSS. Deve ser responsiva.

#### public/eleitos.json

Ver **Carga de dados**.

#### public/favicons

Ícone é o [escudo de armas do Brasil](https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Brazil.svg), gerado utilizando [gerador de favicon](http://realfavicongenerator.net/).

#### public/js

Utilizando últimas versões de [jQuery](https://jquery.com/), [Lazy.js](http://danieltao.com/lazy.js/) e [Highcharts](http://www.highcharts.com/) (versão não paga).

Contém um js próprio com a lógica de cálculo dos índices: `public/js/indice.js` (depende do Lazy.js).


### Desenvolvimento

Servido localmente com [rack](https://rack.github.io/) (ver `Gemfile` e `config.ru`):

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

Para publicar, execute `./publish_to_github.sh`.
