#!/usr/bin/env bash

pushd $(dirname "$0")/_deploy
git pull origin gh-pages
git rm -r .
cp -r ../public/* .
git add -A
git commit -m "$(date -u)"
git push origin gh-pages
popd
