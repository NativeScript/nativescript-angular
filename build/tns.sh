#!/bin/sh
set -e

export NVM_REPO="https://github.com/creationix/nvm.git"
export NVM_DIR="${PROJECT_DIR:-$(pwd)}/.nvm"
export NODE_VER="v5.5.0"

activate_nvm() {
    if [ ! -d "$NVM_DIR" ] ; then
        git clone --depth=1 $NVM_REPO "$NVM_DIR"
    else
        echo "NVM detected at $NVM_DIR"
    fi

    . "$NVM_DIR/nvm.sh"
}

installed_under_nvm() {
    which "$1" | grep -q "$NVM_DIR"
}

install_node() {
    if ! nvm use $NODE_VER ; then
        nvm install $NODE_VER
        nvm use $NODE_VER
    fi
}

install_latest_tns() {
    if installed_under_nvm tns ; then
        echo "tns already installed."
    else
        npm install -g nativescript --ignore-scripts
        tns usage-reporting disable
        tns error-reporting disable
    fi
}

activate_node_env() {
    activate_nvm
    install_node
    install_latest_tns
}
