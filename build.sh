#!/usr/bin/bash

# TODO: cache built files, a la Make
if [ -z "$1" ] ; then
    echo "Expected an argument"
    exit 1
fi
if [ "$1" = "--help" ] ; then
    echo "Usage: build.sh in, [[[internal,] html,] out]"
    exit 0
fi
it="${1%.*}.raw.html"
html="${1%.*}.html"
pdf="${1%.*}.pdf"
if [ -n "$2" ] ; then
    pdf="$2"
fi
if [ -n "$3" ] ; then
    html="$2"
    pdf="$3"
fi
if [ -n "$4" ] ; then
    it="$2"
    html="$3"
    pdf="$4"
fi
if [ -n "$5" ] ; then
    echo "Expected 1-4 arguments: in, [[[internal,] html,] out]"
    exit 1
fi
dn="$(dirname "$0")"

if [ ! -f "$1" ] ; then
    echo "File not found: $1"
    exit 1
fi

echo "(1/8) Converting Markdown to basic HTML ($1)" && 
    pandoc --katex "$1" -o "$it" && 
    echo "(2/8) Adding MathML to HTML             ($it)" &&
    "$dn/scripts/katexify.js" "$it" -o "$html" && 
    echo "(3/8) Converting HTML to PDF            ($html)" &&
    "$dn/scripts/ffhtmltopdf.js" "$html" -o "$pdf"
