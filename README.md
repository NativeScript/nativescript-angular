Integrating NativeScript with Angular 2.

# Running locally

## Get submodule code

The project bundles the NativeScript modules and Angular as source code dependencies set up as git submodules. You need to get them by running:

```
$ git submodule update --init
```

# Prerequisites

Install your native toolchain and NativeScript as described in the docs:

https://docs.nativescript.org/setup/quick-setup


## Install dependencies

```
$ npm install -g grunt-cli gulp
```

Then install the needed NPM packages:

```
$ npm install
```

## Compile and prepare NativeScript and Angular

```
$ grunt
```

## Initialize the test NativeScript app (ng-sample)

```
$ cd ng-sample
$ npm install
```

The latter installs the `angular2` and `tns-core-modules` packages that you just built by running `grunt prepare` step in the project root.

## Run the ng-sample app

```
$ tns run android
$ tns run ios
```

## (Optional) Webpack bundling

Install the webpack tool:

```
$ npm install -g webpack
```

Enable the webpack hook by setting the `WEBPACK_BUILD` environment variable. You can do it with a single command on OSX/Linux using:

```
$ env WEBPACK_BUILD=1 tns run android
```

# Running the tests

```
$ cd tests
$ npm install
$ tns test ios --emulator
```

# Developer workflow:

1. Make changes to `src/nativescript-angular`, and rebuild with `grunt build`. If succesful, you should get a npm package in the project root.
2. Navigate to the ng-sample subdir: `$ cd ng-sample`. Make some changes to the app or `../src/nativescript-angular`.
3. Run with `$ tns run android` or `$ tns run ios`

Note that you should never change files in `ng-sample/src/nativescript-angular/` as they are overwritten with the reference sources in `src/nativescript-angular` on every `grunt app` run.

# Watch the video explaining Angular 2 and NativeScript
[NativeScript session on AngularConnect conference](https://www.youtube.com/watch?v=4SbiiyRSIwo)

# Explore the examples

The `ng-sample` app is meant for testing stuff while developing the renderer code, and isn't the best example out there. You can take a look at these sample apps that use the published builds from npm:

* [Hello world starter](https://github.com/NativeScript/template-hello-world-ng)
* [TodoMVC sample implementation](https://github.com/NativeScript/sample-ng-todomvc)

# Known issues

1. There are certain issues with the Parse5DomAdapter and we'll likely need to provide our own later on:
  * Self-closing elements (`<Label text="Name" /><Button text="Save" />`) get parsed wrong (in this case Button gets parsed as a Label child.
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-angular?pixel) 
