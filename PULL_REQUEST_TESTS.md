### Pull Requests Checks

Builds distributed between Travis CI and internal Jenkins CI execute on pull requests. By default, Travis CI builds trigger on community pull requests and both Travis CI and Jenkins CI builds trigger on core team pull requests. Only NativeScript members have rights to trigger internal Jenkins CI builds. In long term, we aim to migrate all the builds in a public cloud environment.

### Travis

This build compiles the `nativescript-angular` plugin and builds the [tests](https://github.com/NativeScript/nativescript-angular/tree/master/tests) app for Android. Please, refer to the [.travis.yml](https://github.com/NativeScript/nativescript-angular/blob/master/.travis.yml) config file for complete information.

### Jenkins

More extensive tests execute in Jenkins CI. The table below describes how to trigger and the location of the app/tests of all builds available to execute tests on pull requests.

|Comment             |Description|
|:------------------:|:---------:|
|`run ci`            |Executes all described below.|
|`renderer-android`  |Executes [renderer](https://github.com/NativeScript/nativescript-angular/tree/master/e2e/renderer) tests app for Android.|
|`renderer-ios`      |Executes [renderer](https://github.com/NativeScript/nativescript-angular/tree/master/e2e/renderer) tests app for iOS.|
|`router-android`    |Executes [router](https://github.com/NativeScript/nativescript-angular/tree/master/e2e/router) tests app for Android.|
|`router-ios`        |Executes [router](https://github.com/NativeScript/nativescript-angular/tree/master/e2e/router) tests app for iOS.|
|`sdkwebpack`        |Webpacks [SDK](https://github.com/NativeScript/nativescript-sdk-examples-ng) examples app for both Android and iOS.|
|`tests-android`     |Executes [tests](https://github.com/NativeScript/nativescript-angular/tree/master/tests) app for Android.|
|`tests-ios`         |Executes [tests](https://github.com/NativeScript/nativescript-angular/tree/master/tests) app for iOS.|
|`testsappng-android`|Executes [TestsAppNg](https://github.com/NativeScript/tests-app-ng) app for Android.|
|`testsappng-ios`    |Executes [TestsAppNg](https://github.com/NativeScript/tests-app-ng) app for iOS.|
