# 3.0.0 (2017-xx-xx)
- Compatible with Angular 4 and NativeScript 3.0

# 1.1.2 (2016-10-28)
- Angular 2.1.2 compatibility release

# 1.1.1 (2016-10-21)

- Angular 2.1.1 compatibility release
- [Experimental] Support for ahead-of-time(AOT) compilation.

# 1.1.0 (2016-10-13)

- Angular 2.1.0 compatibility release

# 1.0.2 (2016-10-13)

- Angular 2.0.2 compatibility release
- Modal dialogs no longer require that you create a ModalDialogService provider in your component.

# 0.4.0 (2016-08-19)

- Migrate to Angular 2 RC5.
- Bootstrapping apps using NgModule's. The old `nativescriptBootstrap` method is gone, and apps should switch to the `platformNativeScriptDynamic().bootstrapModule(MyAppModule)` API
- The library entrypoint is now the `nativescript-angular/platform` module. Import `NativeScriptRouterModule` from `nativescript-angular/router` and `NativeScriptFormsModule` from `nativescript-angular/forms` respectively if you want to use routing and form value accessor directives.

# 0.1.8 (2016-06-22)

- Migrate to Migrate to Angular RC3 and Angular Router 3.0.0-alpha.7:
   - [Angular RC3 Release Notes](https://github.com/angular/angular/blob/master/CHANGELOG.md#200-rc3-2016-06-21)
   - [Router Alpha.7 Release Notes](https://github.com/angular/angular/blob/master/modules/%40angular/router/CHANGELOG.md#300-alpha7-2016-06-17)

- Build no more requires globally installed **typings**

# 0.1.7 (2016-06-21)

## Features

- [(#291)](https://github.com/NativeScript/nativescript-angular/issues/291) Migrate to Angular RC2

- [(#218)](https://github.com/NativeScript/nativescript-angular/issues/218) Support the new router

## Bug Fixes

- [(#273)](https://github.com/NativeScript/nativescript-angular/issues/273) ModalDialogService.showModal() doesn't show modal

- [(#257)](https://github.com/NativeScript/nativescript-angular/issues/257) iOS navigation bug

- [(#252)](https://github.com/NativeScript/nativescript-angular/issues/252) Using text-decoration in a template causes iOS app to crash

- [(#262)](https://github.com/NativeScript/nativescript-angular/issues/262) Critical - Memory and cpu usage.

- [(#242)](https://github.com/NativeScript/nativescript-angular/issues/242) Use the ComponentFactory API instead of deprecated DynamicComponentLoader

- [(#229)](https://github.com/NativeScript/nativescript-angular/issues/229) Implement ngStyle directive

## Breaking Changes

- The Beta Angular Router moved to `nativescript-angular/router-deprecated` to continue using it change imports:
  - `nativescript-angular/router` -> `nativescript-angular/router-deprecated`
  - `nativescript-angular/router/ns-router` -> `nativescript-angular/router-deprecated/ns-router-deprecated`

- Build requires globally installed **typings** (`npm install -g typings`)
