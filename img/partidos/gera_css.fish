#!/usr/bin/env fish

function encode64
  set -l format
  set -l input_file
  if test (count $argv) -eq 2
    set format $argv[1]
    set input_file $argv[2]
  else
    set format png
    set input_file $argv[1]
  end
  set -l image_file (mktemp).$format
  convert $input_file -format $format $image_file
  echo -n "data:image/$format;base64,"
  python3 -c 'import sys;import urllib.parse;import base64;print(urllib.parse.quote(base64.b64encode(open(sys.argv[1], "rb").read())),end="")' $image_file
end

set programa (ps %self | tail -1 | sed 's/^ *//' | tr -s ' ' | cut -d' ' -f6)
set pasta (dirname $programa)
set raiz $pasta/../..

set css $raiz/tmp/sprites/partidos.css
mkdir -p $raiz/tmp/sprites
echo '.partido {}' > $css

for arquivo in $pasta/*.png
  set codigo (basename $arquivo .png)
  echo ".partido-$codigo { background-image: url(\""( encode64 png $arquivo )"\"); }" >> $css
end
