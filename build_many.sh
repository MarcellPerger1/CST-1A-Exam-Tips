#!/usr/bin/bash

dn="$(dirname "$0")"

for m in "$@" ; do
    ./build.sh "$m" "$dn/res/raw/${m%.md}.raw.html" "$dn/res/${m%.md}.html" "$dn/res/${m%.md}.pdf" &
done
wait
