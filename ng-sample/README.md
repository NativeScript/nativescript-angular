Getting the app to run:

* npm install
* tns platform add android
* grunt app-full. (Make sure you set your NSDIST env var or pass modulesPath/typingsPath options)

Changing and testing the app:
* grunt app
* ./emulateAndroid.sh <avd>

Protip: Use a single command like `grunt app && ./emulateAndroid.sh`
