#!/usr/bin/bash
(git diff --name-only -- "*.md" ; git diff --name-only --staged -- "*.md") | sort -u | xargs ./build_many.sh
