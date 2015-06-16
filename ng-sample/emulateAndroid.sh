#!/usr/bin/env bash
set -e

SCRIPT_DIR=$(readlink -f $(dirname "${BASH_SOURCE[0]}"))
AVD=${1:-nexus4-x64}

cd $SCRIPT_DIR
tns emulate android --avd $AVD &
