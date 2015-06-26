Integrating NativeScript with Angular 2.

# Running locally


## Get submodule code

The project bundles the NativeScript modules and Angular as source code dependencies set up as git submodules. You need to get them by running:

```
$ git submodule update --init
```

## Install dependencies

You will need the [Android SDK](https://developer.android.com/sdk/) to build this project. Install it manually.

Then install the NativeScript tools according to: [this article](http://docs.nativescript.org/setup/quick-setup).

Then install the needed NPM packages:

```
$ npm install
```

## Compile and prepare NativeScript and Angular

```
$ (cd deps/angular/modules/angular2 && tsd reinstall)
$ grunt prepare
```

## Initialize the test NativeScript app (ng-sample)

```
$ grunt shell:ngSampleInit
```

## Compile the app and update its `./src` dir:

```
$ grunt ng-sample
```

# Developer workflow:

1. Make some changes to the app or `src/nativescript-angular`
2. Navigate to the ng-sample subdir: `$ cd ng-sample`
2. Compile app: `$ grunt app`
3. Run in emulator `$ tns emulate android --avd <YOUR-AVD>`

Protip: combine #2 and #3 above in a single command run from the project root directory (works only on Unixy shells):

```
$ (cd ng-sample && grunt app && tns emulate android --avd nexus4-x64)
```

On Windows, you can wrap those commands in a BAT file.

# Finding your way around

1. The `./src/nativescript-angular` folder holds the integration source code.
2. The sample app below `ng-sample` is assembled by copying typescript dependencies in its `src` folder:
    * angular2 source code
    * nativescript-angular code
    * NativeScript typings: typings/nativescript
3. All required JavaScript packages (including compiled NativeScript modules) are copied to `ng-sample/app/tns_modules`

# How the integration code works

1. Use the Angular Parse5DomAdapter to parse component markup.
2. Provide a custom renderer (`NativeScriptRenderer`) that works with the parsed DOM and creates NativeScript UI elements. Only limited number of visual elements supported so far.

# Known issues

1. The renderer code needs to be cleaned up and made extensible, so that people can register new visual elements.
2. There are certain issues with the Parse5DomAdapter and we'll likely need to provide our own later on:
  * Element and attribute names always get lowercased.
  * Self-closing elements (`<Label text="Name" /><Button text="Save" />`) get parsed wrong (in this case Button gets parsed as a Label child.
3. The renderer implementation is by no means complete: we are still need to support view (de)hydration, DOM text updates, event dispatching, actions, etc.
