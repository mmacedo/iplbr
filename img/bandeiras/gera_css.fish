#!/usr/bin/env fish

set programa (ps %self | tail -1 | tr -s ' ' | cut -d' ' -f6)
set pasta (dirname $programa)
set raiz $pasta/../..

set css $raiz/tmp/sprites/bandeiras.css
mkdir -p $raiz/tmp/sprites
echo '.bandeira {}' > $css

for arquivo in $pasta/*.png
  set codigo (basename $arquivo .png)
  echo ".bandeira-$codigo { background-image: url(\""( encode64 png $arquivo )"\"); }" >> $css
end
