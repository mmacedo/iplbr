#!/usr/bin/env bash

# Setup
#  git clone git@github.com:mmacedo/iplbr.git _deploy
#  pushd _deploy
#  git checkout --orphan gh-pages
#  git rm -r --cached .
#  git clean -df
#  cp -r ../public/* .
#  git add -A
#  git commit -m "$(git log master --pretty=format:"%s" | tail -1)"
#  git push origin gh-pages --set-upstream
#  popd

pushd $(dirname "$0")/_deploy
cp -r ../public/* .
git add -A
git commit -m "$(git log master --pretty=format:"%s" | tail -1)"
git push origin gh-pages
popd
