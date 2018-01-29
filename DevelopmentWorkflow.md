# Development Workflow

<!-- TOC depthFrom:2 -->

- [Running locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Install dependencies](#install-dependencies)
    - [Run the sample application (ng-sample)](#run-the-sample-application-ng-sample)
- [Running the tests](#running-the-tests)
- [Developer workflow:](#developer-workflow)

<!-- /TOC -->

## Running locally

### Prerequisites

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/setup/quick-setup


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

Install NPM packages (use the local copy of `nativescript-angular`):
```
$ cd tests
$ npm install
```

Start test run:

```
$ tns test ios
$ tns test android
```

## Developer workflow:

1. Make changes to the `test`, `ng-sample` projects or in `nativescript-angular` folder.
2. Run the `tests` or `ng-sample` as shown above.