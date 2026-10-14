#!/bin/sh
# ./release.sh build            -> dist/odoo-app-hider.zip
# ./release.sh ship [version]   -> Version setzen (optional), bauen, GitHub-Release erstellen, pushen
set -e
cd "$(dirname "$0")"
ASSET=odoo-app-hider.zip   # Name nie ändern, sonst bricht der latest-Link im README
version() { python3 -c "import json; print(json.load(open('src/manifest.json'))['version'])"; }

build() {
  rm -rf dist && mkdir dist
  (cd src && zip -qr "../dist/$ASSET" . -x '.*')
  echo "gebaut: dist/$ASSET (v$(version))"
}

case "$1" in
  build) build ;;
  ship)
    [ -z "$(git status --porcelain)" ] || { echo "Erst committen oder stashen."; exit 1; }
    if [ -n "$2" ]; then
      python3 - "$2" <<'PY'
import json, sys
p = 'src/manifest.json'; m = json.load(open(p)); m['version'] = sys.argv[1]
json.dump(m, open(p, 'w'), indent=2, ensure_ascii=False); open(p, 'a').write('\n')
PY
    fi
    v=$(version)
    if git rev-parse -q --verify "refs/tags/v$v" >/dev/null || gh release view "v$v" >/dev/null 2>&1; then
      echo "v$v gibt es schon, bitte neue Version angeben."; git checkout -q src/manifest.json; exit 1
    fi
    build
    git add src/manifest.json
    git diff --cached --quiet || git commit -qm "Release v$v"
    git push -q
    gh release create "v$v" "dist/$ASSET" --title "v$v" --notes "Chrome-Build v$v"
    echo "veröffentlicht: v$v" ;;
  *) sed -n '2,3p' "$0" ;;
esac
