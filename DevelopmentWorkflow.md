# Development Workflow

<!-- TOC depthFrom:2 -->

- [Development Workflow](#development-workflow)
  - [Running locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Clone repository](#clone-repository)
    - [Install dependencies of the compatibility package (nativescript-angular)](#install-dependencies-of-the-compatibility-package-nativescript-angular)
    - [Install dependencies of the scoped package (@nativescript/angular)](#install-dependencies-of-the-scoped-package-nativescriptangular)
    - [Run some of the e2e applications e.g. router-tab-view](#run-some-of-the-e2e-applications-eg-router-tab-view)
  - [Running the tests](#running-the-tests)
  - [Testing locally by running e2e tests](#testing-locally-by-running-e2e-tests)

<!-- /TOC -->

## Running locally

### Prerequisites

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/angular/start/quick-setup

### Clone repository

```
$ git clone git@github.com:NativeScript/nativescript-angular.git
$ cd nativescript-angular
```

### Install dependencies of the compatibility package (nativescript-angular)

```
$ cd nativescript-angular
$ npm install
```

### Install dependencies of the scoped package (@nativescript/angular)

```
$ cd nativescript-angular-package
$ npm install
```

### Run some of the e2e applications e.g. router-tab-view

Install NPM packages (use the local copy of `nativescript-angular`):
```
$ cd e2e/router-tab-view
$ npm install
```

Start the app:

```
$ tns run android
$ tns run ios
```

Make changes to `nativescript-angular` (in `./nativescript-angular-package` folder) or `@nativescript/angular` (in `./nativescript-angular` folder) and see them applied in the running app.

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
    
## Building Packages

1. Build `@nativescript/angular` (a.k.a. "scoped package"):
    ```
    cd nativescript-angular
    npm install
    npm run pack
    ```

2. Build `nativescript-angular` (a.k.a. "compat-package"): 
    ```
    cd nativescript-angular-package
    npm install
    npm run pack-with-scoped-version -- ../dist/nativescript-angular-scoped.tgz
    ```
Packages are available in the `dist` folder.
