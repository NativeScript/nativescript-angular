# Development Workflow

<!-- TOC depthFrom:2 -->

- [Running locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Install dependencies](#install-dependencies)
    - [Run the sample application (ng-sample)](#run-the-sample-application-ng-sample)
- [Running the tests](#running-the-tests)
- [Testing locally by running e2e tests](#testing-locally-by-running-e2e-tests)
- [Developer workflow](#developer-workflow)

<!-- /TOC -->

## Running locally

### Prerequisites

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/setup/quick-setup

### Clone repository

```
$ git clone git@github.com:NativeScript/nativescript-angular.git
$ cd nativescript-angular
```

### Install dependencies

```
$ cd nativescript-angular
$ npm install
```

### Run the sample application (ng-sample)

Install NPM packages (use the local copy of `nativescript-angular`):
```
$ cd ng-sample
$ npm install
```

Start the app:

```
$ tns run android
$ tns run ios
```

## Running the tests

Install the NPM dependencies (use the local copy of `nativescript-angular`):
```
$ cd tests
$ npm install
```

Run the tests:

```
$ tns test ios
$ tns test android
```

## Testing locally by running e2e tests

NOTE: The steps below describe how to run `renderer` tests, but the same approach can be used to run `router` or any other `e2e` tests.

1. Navigate to `e2e/renderer`
    ``` bash
    cd e2e/renderer
    ```

2. Install dependencies. This also installs your local copy of the nativescript-angular plugin.
    ``` bash
    npm install
    ```
3. Make sure to have an emulator set up or connect a physical Android/iOS device.

4. Build the app for Android or iOS
    ```bash
    tns run android/ios
    ```

5. Install [appium](http://appium.io/) globally.
    ``` bash
    npm install -g appium
    ```

6. Follow the instructions in the [nativescript-dev-appium](https://github.com/nativescript/nativescript-dev-appium#custom-appium-capabilities) plugin to add an appium capability for your device inside `./e2e/renderer/e2e/config/appium.capabilities.json`.

7. Run the automated tests. The value of the `runType` argument should match the name of the capability that you just added.
    ``` bash
    npm run e2e -- --runType capabilityName
    ```

## Developer workflow

1. Open the `nativescript-angular` folder and start a typescript watcher in it `tsc -w`.
2. Make changes to the `test`, `ng-sample`, `e2e` app projects or in `nativescript-angular` folder.
3. Run the `tests`, `ng-sample` or `e2e` apps as shown above.
