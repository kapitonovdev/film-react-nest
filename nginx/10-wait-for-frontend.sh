#!/bin/sh
set -eu

for _ in $(seq 1 30); do
  if [ -f /usr/share/nginx/html/index.html ]; then
    exit 0
  fi

  sleep 1
done

echo "Frontend bundle was not found in /usr/share/nginx/html" >&2
exit 1
