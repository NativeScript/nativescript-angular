<a name="1.5.2"></a>
## [1.5.2](https://github.com/NativeScript/nativescript-angular/compare/v1.5.1...v1.5.2) (2017-04-18)


### Bug Fixes

* use providers' map for injectors in page-router-outlet ([#744](https://github.com/NativeScript/nativescript-angular/issues/744)) ([#748](https://github.com/NativeScript/nativescript-angular/issues/748)) ([c1f5d98](https://github.com/NativeScript/nativescript-angular/commit/c1f5d98)), closes [#741](https://github.com/NativeScript/nativescript-angular/issues/741)



<a name="1.5.1"></a>
## [1.5.1](https://github.com/NativeScript/nativescript-angular/compare/v1.5.0...v1.5.1) (2017-03-30)


### Bug Fixes

* **action bar:** attach #comment nodes with _addView ([#729](https://github.com/NativeScript/nativescript-angular/issues/729)) ([be93db6](https://github.com/NativeScript/nativescript-angular/commit/be93db6)), closes [#725](https://github.com/NativeScript/nativescript-angular/issues/725)
* **ns-router-link:** navigate with urlTree ([#728](https://github.com/NativeScript/nativescript-angular/issues/728)) ([71058f8](https://github.com/NativeScript/nativescript-angular/commit/71058f8)), closes [#724](https://github.com/NativeScript/nativescript-angular/issues/724)



<a name="1.5.0"></a>
# [1.5.0](https://github.com/NativeScript/nativescript-angular/compare/v1.4.1...v1.5.0) (2017-03-22)

### Bug Fixes

* **action-bar:** Don't remove action items twice. ([677d7e0](https://github.com/NativeScript/nativescript-angular/commit/677d7e0))
* **animations:** add onDestroy method to NativeScriptAnimationPlayer ([2e24010](https://github.com/NativeScript/nativescript-angular/commit/2e24010))
* **dom_adapter:** add missing `contains` method signature ([bae45f6](https://github.com/NativeScript/nativescript-angular/commit/bae45f6))
* **dom_adapter:** update setTitle and getGlobalEventTarget to be compliant with Angular API ([25c134d](https://github.com/NativeScript/nativescript-angular/commit/25c134d))
* **gitignore:** Add editor files into gitignore ([819a960](https://github.com/NativeScript/nativescript-angular/commit/819a960))
* **init:** Bootstrap Angular on page "navigatingTo" event. ([ab04aba](https://github.com/NativeScript/nativescript-angular/commit/ab04aba))
* **list-view-comp:** IterableDiffer is now parameterized on \<KeyedTemplate\> ([780967d](https://github.com/NativeScript/nativescript-angular/commit/780967d))
* **ns-http:** make defaultOptions of type RequestOptions ([db730e2](https://github.com/NativeScript/nativescript-angular/commit/db730e2))
* **page-router-outlet:** activateWith instead of activate method ([8d832bc](https://github.com/NativeScript/nativescript-angular/commit/8d832bc))
* **page-router-outlet:** manually run detect changes when navigating to new page ([07caa74](https://github.com/NativeScript/nativescript-angular/commit/07caa74))
* **platform:** import InjectionToken and ViewEncapsulation instead of OpaqueToken ([c4dc8d4](https://github.com/NativeScript/nativescript-angular/commit/c4dc8d4))
* **platform:** import MissingTranslationStrategy ([d2328a5](https://github.com/NativeScript/nativescript-angular/commit/d2328a5))
* **renderer:** implement createComment and createText methods using Placeholders ([c0ec870](https://github.com/NativeScript/nativescript-angular/commit/c0ec870))
* **renderer:** use _eachChildView for nextSibling ([150c1ce](https://github.com/NativeScript/nativescript-angular/commit/150c1ce))
* **renderer:** use flags  in `setStyle` and `removeStyle` instead of booleans ([a6d9247](https://github.com/NativeScript/nativescript-angular/commit/a6d9247))
* **ts:** ship package with reference to iterable interface ([7edfa6b](https://github.com/NativeScript/nativescript-angular/commit/7edfa6b))


### Code Refactoring

* stop exporting NativeScriptModule from platform ([#701](https://github.com/NativeScript/nativescript-angular/issues/701)) ([409e717](https://github.com/NativeScript/nativescript-angular/commit/409e717))


### Features

* **animations:** introduce NativeScriptAnimationsModule ([b5874ba](https://github.com/NativeScript/nativescript-angular/commit/b5874ba))
* **renderer:** implement simple nextSibling method using parent's _eachChildView ([98d9d20](https://github.com/NativeScript/nativescript-angular/commit/98d9d20))
* **renderer:** upgrade to be compliant with Angular 4's Renderer2 and RendererFactory2 ([a3adcca](https://github.com/NativeScript/nativescript-angular/commit/a3adcca))
* **renderer:** use EmulatedRenderer to scope component styles ([25f5111](https://github.com/NativeScript/nativescript-angular/commit/25f5111))


### BREAKING CHANGES

* **NativeScriptModule:** User applications cannot import NativeScriptModule from
"nativescript-angular/platform" anymore.
Migration:
Before:
```
import { NativeScriptModule } from "nativescript-angular/platform";
```
After
```
import { NativeScriptModule } from
"nativescript-angular/nativescript.module";
```
* **animations:** To use animations, you need to import the
NativeScriptAnimationsModule from "nativescript-angular/animations" in
your root NgModule. Also you need a dependency to "@angular/animations".

* **typescript:** The required version of TypeScript is ~2.1. Support for ~2.2 requires changes in `tns-core-modules` and will be provided with NativeScript 3.0.


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
