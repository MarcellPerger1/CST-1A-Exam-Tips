#!/usr/bin/bash

if [ -z "$1" ] ; then
    echo "Expected an argument"
    exit 1
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

echo "Converting Markdown to basic HTML" && 
    pandoc --katex "$1" -o "$it" && 
    echo "Adding MathML to HTML" &&
    "$dn/build/katexify.js" "$it" -o "$html" && 
    echo "Converting HTML to PDF" &&
    "$dn/build/ffhtmltopdf.js" "$html" -o "$pdf"
