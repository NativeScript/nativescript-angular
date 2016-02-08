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
# works around an android build bug with multiple semver*.gz files in node_modules
find node_modules/ -iname '*.gz' -delete

wait "$EMULATOR_STARTER_PID"

# generate some output while running tests to prevent Travis from killing the build
"$PROJECT_DIR/build/test-output-generator.sh"  &
OUTPUT_GENERATOR_PID=$!
tns test android | tee test-output.txt
kill $OUTPUT_GENERATOR_PID
if grep -q -E 'BUILD FAILED' test-output.txt ; then
    echo "TEST BUILD FAILED!"
    exit 1
fi

if grep -q -E 'Executed[[:space:]][[:digit:]]+.*FAILED' test-output.txt ; then
    echo "TESTS FAILED!"
    exit 1
else
    echo "TESTS SUCCEEDED."
    exit 0
fi
