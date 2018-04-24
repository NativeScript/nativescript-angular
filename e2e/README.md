# NativeScript Angular E2E Tests

This folder contains a number of projects containing e2e tests for NativeScript Angular integration.

## Projects Description

 - [`renderer`](renderer) - Tests for the nativescript-angular renderer features. Creating/adding/removing elements for the nativescript visual tree.

 - [`router`](router) - Tests for angular router and navigation. This app contains a mixed scenario with `<page-router-outlet>` and `<router-outlet>`.

 - [`single-page`](single-page) - Tests for angular router and navigation. This is a simple app with only one level navigation using `<router-outlet>`.

 - [`modal-navigation-ng`](modal-navigation-ng) - Tests for different scenarios of showing and navigation in modal dialogs.

 - [`router-tab-view`](router-tab-view) - Tests for navigation in a TabComponent containing named(aux) `<page-router-outlet>` instances.

## Global Appium Setup

Install external dependencies for nativescript-dev-appium described [here](https://github.com/NativeScript/nativescript-dev-appium#setup).


All projects use the same [appium capabilities files](config/appium.capabilities.json). Make sure you p


## Running Tests

Make sure you build or run the project with the NativeScript CLI first:
```
tns build android
tns run ios
```

Run appium tests with the `e2e` npm task. Check ns-dev-appium options [here](https://github.com/NativeScript/nativescript-dev-appium#options)

Examples:

```
npm run e2e -- --runType android23

npm run e2e -- --runType sim.iPhone8.iOS112
```

For **development** you can use `--devMode` flag to reuse the current emulator and the currently installed application:

Examples:
```
npm run e2e -- --runType android23 --devMode

npm run e2e -- --runType sim.iPhone8.iOS112 --devMode
```
