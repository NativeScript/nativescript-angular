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
