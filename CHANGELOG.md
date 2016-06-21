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