set -e

ENV="${ENV:-dev}"
DIST_DIR="nativescript-angular/bin/dist"
APIREF_DIR="$DIST_DIR/ng-api-reference"
rm -rf "$APIREF_DIR"
cd "nativescript-angular"
npm install
npm run typedoc
