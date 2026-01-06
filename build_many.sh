#!/usr/bin/bash

dn="$(dirname "$0")"

for m in "$@" ; do
    ./build.sh "$m" "$dn/out/raw/${m%.md}.raw.html" "$dn/out/${m%.md}.html" "$dn/out/${m%.md}.pdf" &
done
wait
