# NativeScript + TypeScript

This is a sample project wrapping the `tns` commands in a Grunt script that compiles the TypeScript code and assembles the correct `app` folder structure.

# How it works?

* We keep everything below `./src`. **DO NOT PUT ANYTHING IMPORTANT IN `./app`**
* The TypeScript compiler puts transpiled `.js` files in `./app'
* A Grunt task updates all app assets and the `tns_modules` folder too.

# Setting it up

```sh
$ npm install
$ tns platform add android
$ tns platform add ios
$ grunt app-full.
```

When done, run the emulator (see below).

# Development workflow

* Edit some files.
* Start the emulator using: `grunt run-android --avd <YOUR AVD>` or `grunt run-ios --device <YOUR DEVICE>`
    * Hit Ctrl-C when done.

# Upgrading to a newer NativeScript version

* Update your platforms.
* Update your `src/tns_modules` folder with the latest version of the module code.
* Remove the 1.2 `*.d.ts` files below `src/typings/nativescript/1.2` and add the new type declarations in a similarly named folder.
