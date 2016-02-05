#!/bin/sh
set -e

wait_for_emulator() {
    adb wait-for-device

    A=$(adb shell getprop sys.boot_completed | tr -d '\r')

    while [ "$A" != "1" ]; do
            sleep 2
            A=$(adb shell getprop sys.boot_completed | tr -d '\r')
    done

    adb shell input keyevent 82
}

create_emulator() {
    echo no | android create avd --force -n Arm19 -t android-19 -b armeabi-v7a
}

start_emulator() {
    emulator -avd Arm19 -no-skin -no-audio -no-boot-anim -no-window &
}

create_emulator
start_emulator
wait_for_emulator
