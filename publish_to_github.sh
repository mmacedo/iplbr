#!/usr/bin/env bash

function discard_local_changes() {
  git reset HEAD -- .
  git checkout -- .
  git clean -df
}

function add_changes() {
  git rm -r .
  cp -r ../public/* .
}

function commit_changes() {
  git add -A
  git commit -m "$(date -u)"
}

pushd $(dirname "$0")/_deploy
discard_local_changes
git pull origin gh-pages
add_changes
commit_changes
git push origin gh-pages
popd
