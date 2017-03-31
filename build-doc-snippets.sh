#!/usr/bin/env bash
set -e

DIST_DIR="bin/dist"
TARGET_DIR="$DIST_DIR/snippets"
PACKAGE_VERSION="${PACKAGE_VERSION:-0.0.0}"

extractSnippets() {
    BIN="./node_modules/markdown-snippet-injector/extract.js"
    node "$BIN" --root="." --target="$TARGET_DIR" \
        --sourceext=".js|.ts|.xml|.html|.css"
}

npm install markdown-snippet-injector
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

extractSnippets

(cd "$DIST_DIR" && tar zcvf "nativescript-angular-snippets-$PACKAGE_VERSION.tar.gz" snippets)
