#!/usr/bin/env bash
# One-off: mirror the old Joomla site (pages + images) into ./_mirror so it can be converted.
set -uo pipefail
mkdir -p _mirror && cd _mirror
for base in https://www.heat-pipes.com http://www.heat-pipes.com https://heat-pipes.com; do
  echo "Trying $base"
  if curl -fsSIL -m 30 -A "Mozilla/5.0" --ciphers 'DEFAULT@SECLEVEL=0' "$base/" >/dev/null 2>&1 || curl -fsSIL -m 30 -A "Mozilla/5.0" "$base/" >/dev/null 2>&1; then
    BASE=$base; break
  fi
done
echo "Using ${BASE:?no reachable base}"
curl -sSIL -m 30 -A "Mozilla/5.0" "$BASE/" > headers.txt || true
curl -fsSL -m 30 -A "Mozilla/5.0" "$BASE/robots.txt" -o robots.txt || true
curl -fsSL -m 30 -A "Mozilla/5.0" "$BASE/sitemap.xml" -o sitemap.xml || true
curl -fsSL -m 30 -A "Mozilla/5.0" "$BASE/.htaccess" -o htaccess.txt || true
wget --no-check-certificate -e robots=off -U "Mozilla/5.0" --recursive --level=4 --page-requisites \
  --no-parent --domains=www.heat-pipes.com,heat-pipes.com --reject-regex='(/administrator|/component/users|\?.*(print|tmpl|format)=|/feed)' \
  --adjust-extension --restrict-file-names=windows --wait=0.3 --tries=2 --timeout=30 \
  --quota=400m "$BASE/" 2>&1 | tail -n 200 > wget.log || true
find . -type f | sort > files.txt
du -sh .
