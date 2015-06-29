#!/usr/bin/env bash

echo web:
ls -dS public/index.html public/css/index.css public/js/app/* 2>/dev/null | xargs wc

echo
echo spec:
ls -dS spec/helpers/*_helper.js spec/*_spec.js 2>/dev/null | xargs wc

echo
echo carga:
ls -dS carga/*.rb carga/eleitos/presidentes.txt 2>/dev/null | xargs wc

echo
echo scripts:
ls -dS *.{ru,sh} Gemfile Rakefile 2>/dev/null | xargs wc

echo
echo doc:
ls -dS *.md carga/*.md  2>/dev/null | xargs wc
