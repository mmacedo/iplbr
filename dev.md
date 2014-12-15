# Desenvolvimento

## Carga de dados

1. Siga as instruções em `carga/resultados_no_tse.md` para adquirir os arquivos necessários do TSE (~0.5GB de download e mais 6GB de espaço para extrair).
2. Execute `carga/importa_eleitos.rb` para gerar listas de eleitos em `carga/eleitos` (20MB de espaço, 1h de processamento).
3. (opcional) Complete manualmente as listas de eleitos, os dados do TSE são bastante faltosos.
4. Execute `carga/gera_json.rb` para gerar um JSON com totais de eleitos em `public/eleitos.json`.

## Website

1. Instale o site com `bundle install`.
2. Rode o servidor com `bundle exec rackup`.
3. Acesse a página em `http://localhost:9292`.

Observação: Mantenha minimalista (ver `Gemfile` e `config.ru`).
