#! /usr/bin/env zsh

rm dist/*

# create dist
rm -rf dist || echo 'dist/ not present, creating...'
mkdir dist

# bundle to tmpfiles
/home/rg/.deno/bin/deno bundle cli/linnaeus.ts > dist/linnaeus

touch dist/linnaeus.shebang

# create shebangs
echo '#!/bin/sh'                                                 >> dist/linnaeus.shebang
echo '//bin/true; exec /home/rg/.deno/bin/deno run -A "$0" "$@"' >> dist/linnaeus.shebang

# chmod
chmod +x dist/linnaeus

cat dist/linnaeus.shebang dist/linnaeus > dist/linnaeus.bin
sudo cp dist/linnaeus.bin /usr/bin/linnaeus

echo '📷 linnaeus bundled.'
