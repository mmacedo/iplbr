#!/usr/bin/env bash

# Todos os arquivos mantidos

function imprime_contagem() {
  eval ls -dS $* 2>/dev/null | xargs wc
}

web='public/index.html public/js/app/*.js'
spec='spec/*_spec.js'
carga='carga/*.rb carga/eleitos/presidentes.txt carga/eleitos/governadores_bionicos.txt'
etc='Gemfile *.{js,json,sh,yml} .*{rc,.yml} spec/.*rc .git{ignore,attributes} dashboard/connect-*.js dashboard/web/index.html dashboard/web/css/led.css'
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

# JavaScript

function linhas_de_codigo() {
  ret=$(eval cat $* | grep -v '^\([ {}(),;[]\|\\]\)*$' | grep -v '^ *\([*]\|/[/*]\)' | wc -l)
}

function linhas_de_documentacao() {
  ret=$(eval cat $* | grep '^ *\([*]\|/[/*]\)' | wc -l)
}

linhas_de_codigo spec/*_spec.js
spec=$ret
linhas_de_codigo public/js/app/*.js
total=$ret
linhas_de_documentacao public/js/app/*.js
documentacao=$ret

echo
echo   "----------"
echo   "JavaScript"
echo   "----------"
echo
printf "Código:       %7s\n" $total
printf "Documentação: %7s\n" $documentacao
printf "Testes:       %7s\n" $spec
