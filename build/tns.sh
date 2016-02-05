#!/bin/sh
set -e

export NVM_REPO="https://github.com/creationix/nvm.git"
export NVM_DIR="$(pwd)/.nvm"
export NODE_VER="v5.5.0"

install_nvm() {
    if [ ! -d "$NVM_DIR" ] ; then
        git clone --depth=1 $NVM_REPO "$NVM_DIR"
    else
        echo "NVM detected at $NVM_DIR"
    fi
}

activate_nvm() {
    . "$NVM_DIR/nvm.sh"
}

installed_under_nvm() {
    which "$1" | grep -q "$NVM_DIR"
}

install_node() {
    nvm install $NODE_VER
    nvm use $NODE_VER
}


install_latest_tns() {
    if installed_under_nvm tns ; then
        echo "tns already installed."
    else
        npm install -g nativescript --ignore-scripts
    fi
}

activate_node_env() {
    install_nvm
    activate_nvm
    install_node
    install_latest_tns
}
