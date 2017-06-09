This is a test.

[![Build Status](https://travis-ci.org/NativeScript/nativescript-angular.svg?branch=master)](https://travis-ci.org/NativeScript/nativescript-angular)

Integrating NativeScript with Angular.

# Running locally

## Prerequisites

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/setup/quick-setup


## Install dependencies

```
$ cd nativescript-angular
$ npm install
```

## Run the sample application (ng-sample)

Install NPM packages (use the local copy of `nativescript-angular`):
```
$ cd ng-sample
$ npm install
$ npm install ../nativescript-angular
```

Start the app:

```
$ tns run android
$ tns run ios
```

# Running the tests

Install NPM packages (use the local copy of `nativescript-angular`):
```
$ cd tests
$ npm install
$ npm install ../nativescript-angular
```

Start test run:

```
$ tns test ios --emulator
$ tns test android --emulator
```

# Developer workflow:

## Setup:
Use `npm link` to link `nativescript-angular` in `tests` and `ng-sample` progects:

```
cd nativescript-angular
npm link
cd ../ng-sample
npm link nativescript-angular
cd ../tests
npm link nativescript-angular
```

## Work
1. Make changes to the `test`, `ng-sample` projects or in `nativescript-angular` folder.
2. Run the `tests` or `ng-sample` using as shown above.

# Watch the video explaining Angular and NativeScript
[NativeScript session on AngularConnect conference](https://www.youtube.com/watch?v=4SbiiyRSIwo)

# Explore the examples

The `ng-sample` app is meant for testing stuff while developing the renderer code, and isn't the best example out there. You can take a look at these sample apps that use the published builds from npm:

* [Hello world starter](https://github.com/NativeScript/template-hello-world-ng)
* [TodoMVC sample implementation](https://github.com/NativeScript/sample-ng-todomvc)

# Known issues

1. There are certain issues with the Parse5DomAdapter and we'll likely need to provide our own later on:
  * Self-closing elements (`<Label text="Name" /><Button text="Save" />`) get parsed wrong (in this case Button gets parsed as a Label child.
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-angular?pixel) 
