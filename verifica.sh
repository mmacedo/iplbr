#!/usr/bin/env bash

echo bootlint:
echo
bootlint public/index.html

echo
echo

echo jshint:
echo
jshint --verbose public/js/app/* spec/helpers/*.js spec/*.js

echo
echo

echo jscs:
echo
jscs public/js/app/* spec/helpers/*.js spec/*.js
