#!/usr/bin/bash

dn="$(dirname "$0")"

if [ "$1" = "--help" ] ; then
    echo "Usage: build_many.sh [filesname...]"
    echo "Note: files must be relative to the directory containing this script (not cwd)"
    exit 0
fi

for m in "$@" ; do
    ./build.sh "$m" "$dn/res/raw/${m%.md}.raw.html" "$dn/res/${m%.md}.html" "$dn/res/${m%.md}.pdf" &
done
wait
