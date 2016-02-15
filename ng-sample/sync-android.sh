#!/bin/sh
APPNAME="$1" # e.g. org.nativescript.myapp
APPFOLDER="data/data/$APPNAME/files/app"
NSACTIVITY="com.tns.NativeScriptActivity"

cd app
for file_match in "*.js" "*.xml" "*.css"; do
    find . -iname "$file_match" -print0 | \
        xargs -0 -I FILEPATH -P 16 adb push "FILEPATH" "$APPFOLDER/FILEPATH" \;
done

adb shell am force-stop "$APPNAME"
adb shell am start -a android.intent.action.MAIN -n "$APPNAME/$NSACTIVITY"
