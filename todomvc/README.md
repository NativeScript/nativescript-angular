# NativeScript + AngularJS TodoMVC example

This is a sample project implementing the famous TodoMVC example using NativeScript and AngularJS

# Set up prerequisites

You need to prepare the NativeScript distribution in the parent folder by executing all steps in the parent README:

(All run from the parent folder once.)

1. Update git submodules.
2. Install dependencies.
3. `npm install`
4. Install angular2 tsd typings.
5. `grunt prepare`

# Set up the project

0. `cd todomvc`
1. `npm install`
2. `tsd reinstall`
3. `tns platform add android`

# Compile

```sh
grunt app-full
```

# Run in the emulator

Android SDK emulated device:

```sh
tns emulate android --avd my-nexus7-device
```

or Genymotion

```sh
tns emulate android --geny my-nexus7-device
```
