#!/usr/bin/env bash

if [[ $(git status --porcelain public) ]]
then
  echo 'O diretório "public" tem mudanças não persistidas!'
  exit 1
fi

function descartar_mudancas_locais() {
  git reset HEAD -- .
  git checkout -- .
  git clean -df
}

function puxar_alteracoes() {
  git pull origin gh-pages
}

function adicionar_arquivos() {
  git rm -r .
  cp -r ../../public/* .
}

function adicionar_no_git() {
  git add -A
  git commit -m "$(date -u)"
}

function echo_timestamp() {
  echo "[$(date -u)] $*"
}

set -e

echo_timestamp 'Deploying…'

pushd $(dirname "$0")/tmp/_deploy >/dev/null
descartar_mudancas_locais >/dev/null
echo_timestamp 'Puxando alterações do GitHub…'
puxar_alteracoes >/dev/null 2>&1
echo_timestamp 'Fazendo alterações…'
adicionar_arquivos >/dev/null
adicionar_no_git >/dev/null || ( echo; echo 'Nada para publicar!' >&2; exit 1 )
echo_timestamp 'Jogando alterações para o GitHub…'
git push origin gh-pages --quiet
popd >/dev/null

echo_timestamp 'Deployed!'
