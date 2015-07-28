#!/usr/bin/env bash

# Todos os arquivos mantidos

function imprime_contagem() {
  eval ls -dS $* 2>/dev/null | xargs wc
}

web='public/index.html public/js/app/*.js'
spec='spec/*_spec.js'
carga='carga/*.rb carga/eleitos/presidentes.txt carga/eleitos/governadores_bionicos.txt'
etc='Gemfile *.{js,json,sh,yml} .*{rc,.yml} spec/.*rc .git{ignore,attributes}'
dashboard='dashboard/server/*.js dashboard/iframe/iframeUrl.js dashboard/web/index.html dashboard/web/js/index.js dashboard/web/css/led.css'
doc='*.md carga/*.md'

echo web:
imprime_contagem $web
echo
echo spec:
imprime_contagem $spec
echo
echo doc:
imprime_contagem $doc
echo
echo carga:
imprime_contagem $carga
echo
echo etc:
imprime_contagem $etc
echo
echo dashboard:
imprime_contagem $dashboard
echo
echo TOTAL:
eval cat $web $spec $carga $etc $dashboard $doc | wc

# JavaScript

regex_vazio='^[^a-zA-Z0-9]*$'
regex_comentario='^ *\([*]\|/[/*]\)'

function linhas_de_codigo() {
  ret=$(eval cat $* | grep -v "$regex_vazio" | grep -v "$regex_comentario" | wc -l)
}

function linhas_vazias() {
  ret=$(eval cat $* | grep "$regex_vazio" | grep -v "$regex_comentario" | wc -l)
}

function linhas_de_documentacao() {
  ret=$(eval cat $* | grep "$regex_comentario" | wc -l)
}

linhas_de_codigo spec/*_spec.js
spec=$ret
linhas_de_codigo public/js/app/*.js
codigo=$ret
linhas_de_documentacao public/js/app/*.js
documentacao=$ret
linhas_vazias public/js/app/*.js
vazias=$ret

echo
echo   "--------------------------"
echo   "JavaScript - public/js/app"
echo   "--------------------------"
echo
printf "Código:       %5s\n" $codigo
printf "Documentação: %5s\n" $documentacao
printf "Vazias:       %5s\n" $vazias
echo
printf "Testes:       %5s\n" $spec
