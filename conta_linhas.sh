#!/usr/bin/env bash

function imprime_contagem() {
  eval ls -dS $* 2>/dev/null | xargs wc
}

web='public/index.html public/js/app/*.js public/js/app/**/*.js'
spec='spec/*_spec.js'
carga='carga/*.rb carga/eleitos/presidentes.txt carga/eleitos/governadores_bionicos.txt'
etc='*.sh Gemfile Gruntfile.js package.json .*rc spec/.*rc .travis.yml .git{ignore,attributes}'
doc='*.md carga/*.md'

echo web:
imprime_contagem $web
echo
echo spec:
imprime_contagem $spec
echo
echo carga:
imprime_contagem $carga
echo
echo etc:
imprime_contagem $etc
echo
echo doc:
imprime_contagem $doc
echo
echo TOTAL:
eval cat $web $spec $carga $etc $doc | wc
