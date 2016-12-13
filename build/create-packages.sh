#!/bin/bash

PACKAGE_DIR=./nativescript-angular
SCRIPTS_DIR=./build

remove_unneeded_files() {
    # not needed for commonjs build
    rm $PACKAGE_DIR/bundle.all.js
}

create_commonjs_package() {
    remove_unneeded_files
    node $SCRIPTS_DIR/update-version.js
    cd $PACKAGE_DIR
    npm run commonjs-build
    cd ..
    npm pack $PACKAGE_DIR
}

create_es6_package() {
    node $SCRIPTS_DIR/update-version.js es6
    cd $PACKAGE_DIR
    npm run es6-build
    cd ..
    npm pack $PACKAGE_DIR
}

create_commonjs_package

create_es6_package

node $SCRIPTS_DIR/update-version.js
