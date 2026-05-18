#!/bin/sh
set -eu

rm -rf /frontend-dist/*
cp -r /app/dist/. /frontend-dist/

tail -f /dev/null
