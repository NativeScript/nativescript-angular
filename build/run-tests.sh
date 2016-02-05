#!/bin/sh
set -e

SCRIPT=$(readlink -f "$0")
BUILD_DIR=$(dirname "$SCRIPT")
PROJECT_DIR=$(dirname "$BUILD_DIR")

"$PROJECT_DIR/build/start-android-emulator.sh"  &
EMULATOR_STARTER_PID=$!

. "$PROJECT_DIR/build/tns.sh"

activate_node_env

cd "$PROJECT_DIR/tests"

npm install
rm -rf platforms/android
tns platform add android

wait "$EMULATOR_STARTER_PID"
tns test android | tee test-output.txt

if grep -q -E 'Executed[[:space:]][[:digit:]]+.*FAILED' test-output.txt ; then
    echo "TESTS FAILED!"
    exit 1
else
    echo "TESTS SUCCEEDED."
    exit 0
fi
