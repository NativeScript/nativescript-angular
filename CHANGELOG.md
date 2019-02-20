<a name="7.2.2"></a>
## [7.2.2](https://github.com/NativeScript/nativescript-angular/compare/7.2.1...7.2.2) (2019-02-19)


### Bug Fixes

* **list-view:** add support for default item template ([4061cc7](https://github.com/NativeScript/nativescript-angular/commit/4061cc7))



<a name="7.2.1"></a>
## [7.2.1](https://github.com/NativeScript/nativescript-angular/compare/7.2.0...7.2.1) (2019-02-10)


### Bug Fixes

* **location-strategy:** extend support for nested primary outlets ([566896d](https://github.com/NativeScript/nativescript-angular/commit/566896d))
* Router tracing does not work with webpack ([e87ef68](https://github.com/NativeScript/nativescript-angular/commit/e87ef68))



<a name="7.2.0"></a>
# [7.2.0](https://github.com/NativeScript/nativescript-angular/compare/7.1.2...7.2.0) (2019-01-31)


### Bug Fixes

* **p-r-o:** needless forward navigation after back inside nested named outlet ([130e392](https://github.com/NativeScript/nativescript-angular/commit/130e392))


### Features

* **router:** detach change detection on navigation ([#1507](https://github.com/NativeScript/nativescript-angular/issues/1507)) ([86cd290](https://github.com/NativeScript/nativescript-angular/commit/86cd290))



<a name="7.1.2"></a>
## [7.1.2](https://github.com/NativeScript/nativescript-angular/compare/7.1.1...7.1.2) (2019-01-21)


### Bug Fixes

 * **page-router-outlet:** fix(empty-outlet): remove unnecessary moduleId ([#1686](https://github.com/NativeScript/nativescript-angular/issues/1686)) ([1222e57](https://github.com/NativeScript/nativescript-angular/commit/1222e57))


<a name="7.1.1"></a>
## [7.1.1](https://github.com/NativeScript/nativescript-angular/compare/7.1.0...7.1.1) (2018-12-20)


### Bug Fixes

 * **page-router-outlet:** prevent needless forward navigation after back inside nested named outlet ([d8a0653](https://github.com/NativeScript/nativescript-angular/commit/d8a0653))



<a name="7.1.0"></a>
# [7.1.0](https://github.com/NativeScript/nativescript-angular/compare/7.0.3...7.1.0) (2018-12-07)


### Features

* Angular 7.1 support

<a name="7.0.3"></a>
## [7.0.3](https://github.com/NativeScript/nativescript-angular/compare/7.0.2...7.0.3) (2018-12-05)


### Bug Fixes

* **router:** handle nested primary p-r-o ([#1645](https://github.com/NativeScript/nativescript-angular/issues/1645)) ([e632fc5](https://github.com/NativeScript/nativescript-angular/commit/e632fc5))



<a name="7.0.2"></a>
## [7.0.2](https://github.com/NativeScript/nativescript-angular/compare/7.0.1...7.0.2) (2018-11-26)


### Bug Fixes

* **page-router-outlet:** actionBarVisibility not applied ([#1621](https://github.com/NativeScript/nativescript-angular/issues/1621)) ([a6ff509](https://github.com/NativeScript/nativescript-angular/commit/a6ff509))
* **router-extensions:** unable to go back with relativeTo param ([#1632](https://github.com/NativeScript/nativescript-angular/issues/1632)) ([63900dc](https://github.com/NativeScript/nativescript-angular/commit/63900dc))



<a name="7.0.1"></a>
## [7.0.1](https://github.com/NativeScript/nativescript-angular/compare/7.0.0...7.0.1) (2018-11-20)


### Bug Fixes

* crash in deactivate page router outlet ([#1590](https://github.com/NativeScript/nativescript-angular/issues/1590)) ([f8c7468](https://github.com/NativeScript/nativescript-angular/commit/f8c7468))
* **dialogs:** unable to reopen shared modal view when tab as root ([199c245](https://github.com/NativeScript/nativescript-angular/commit/199c245))
* **location-strategy:** crash when going back on nested named lazy loaded module ([#1618](https://github.com/NativeScript/nativescript-angular/issues/1618)) ([d9ffb83](https://github.com/NativeScript/nativescript-angular/commit/d9ffb83))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/NativeScript/nativescript-angular/compare/6.2.0...7.0.0) (2018-11-12)


### Bug Fixes

* crash in deactivate page router outlet ([#1590](https://github.com/NativeScript/nativescript-angular/issues/1590)) ([f8c7468](https://github.com/NativeScript/nativescript-angular/commit/f8c7468))

* **location-strategy:** crash on going back to TabView with nested outlets ([#1582](https://github.com/NativeScript/nativescript-angular/issues/1582)) ([f755991](https://github.com/NativeScript/nativescript-angular/commit/f755991))


### Features

* Angular 7 support



<a name="6.2.0"></a>
# [6.2.0](https://github.com/NativeScript/nativescript-angular/compare/6.1.0...6.2.0) (2018-10-30)


### Bug Fixes

* **frame-service:** move FrameService provider to NativeScriptModule ([#1489](https://github.com/NativeScript/nativescript-angular/issues/1489)) ([3b434c9](https://github.com/NativeScript/nativescript-angular/commit/3b434c9))
* Import reflect-metadata(needed in JIT mode) before [@angular](https://github.com/angular) ([#1530](https://github.com/NativeScript/nativescript-angular/issues/1530)) ([6e45af0](https://github.com/NativeScript/nativescript-angular/commit/6e45af0))
* Persist the original "parentNode" when "retrieving" the root View created by createEmbeddedView ([#1542](https://github.com/NativeScript/nativescript-angular/issues/1542)) ([0b8d2c5](https://github.com/NativeScript/nativescript-angular/commit/0b8d2c5))


### Features

* add actionBarVisibility property to page-router-outlet ([#1573](https://github.com/NativeScript/nativescript-angular/issues/1573)) ([c645ca8](https://github.com/NativeScript/nativescript-angular/commit/c645ca8))
* enable nesting named page router outlets ([#1556](https://github.com/NativeScript/nativescript-angular/issues/1556)) ([46a0dc0](https://github.com/NativeScript/nativescript-angular/commit/46a0dc0))
* HMR bootstrap and livesync options ([#1531](https://github.com/NativeScript/nativescript-angular/issues/1531)) ([1e92c7b](https://github.com/NativeScript/nativescript-angular/commit/1e92c7b))



<a name=""></a>
## [6.1.0](https://github.com/NativeScript/nativescript-angular/compare/6.0.6...6.1.0) (2018-08-06)


### Bug Fixes

* mark NativeScriptModule as root injector ([#1418](https://github.com/NativeScript/nativescript-angular/issues/1418)) ([ce70add](https://github.com/NativeScript/nativescript-angular/commit/ce70add))
* provide NullViewportScroller in NativeScriptModule ([dd412bf](https://github.com/NativeScript/nativescript-angular/commit/dd412bf))
* **animations:** inject document object in the animation engine ([#1395](https://github.com/NativeScript/nativescript-angular/issues/1395)) ([379e958](https://github.com/NativeScript/nativescript-angular/commit/379e958)), closes [angular/angular#23300](https://github.com/angular/angular/issues/23300) [#1393](https://github.com/NativeScript/nativescript-angular/issues/1393)
* **forms:** TextValueAccessor raises onTouched on blur ([#1230](https://github.com/NativeScript/nativescript-angular/issues/1230)) ([06ca3a0](https://github.com/NativeScript/nativescript-angular/commit/06ca3a0))
* remove global document object ([2b201be](https://github.com/NativeScript/nativescript-angular/commit/2b201be))
* **location-strategy:** find the correct outlet when navigating back and forward ([#1404](https://github.com/NativeScript/nativescript-angular/issues/1404)) ([f0119a0](https://github.com/NativeScript/nativescript-angular/commit/f0119a0))
* **modal:** lower isModalNavigation flag when closing modal ([#1378](https://github.com/NativeScript/nativescript-angular/issues/1378)) ([6ab1cac](https://github.com/NativeScript/nativescript-angular/commit/6ab1cac))
* **modal:** throw from tns-core-modules is now properly caught and rejected ([70730d9](https://github.com/NativeScript/nativescript-angular/commit/70730d9))
* **router:** avoiding throw for app stability improvements ([#1344](https://github.com/NativeScript/nativescript-angular/issues/1344)) ([82747df](https://github.com/NativeScript/nativescript-angular/commit/82747df))
* **tabview:** implement setter for TabViewItem Directive's configuration ([#845](https://github.com/NativeScript/nativescript-angular/issues/845)) ([#1370](https://github.com/NativeScript/nativescript-angular/issues/1370)) ([1d44679](https://github.com/NativeScript/nativescript-angular/commit/1d44679))


### Features

* **test-bed:** Run render fixtures in a full-page container ([#1416](https://github.com/NativeScript/nativescript-angular/issues/1416)) ([e551df2](https://github.com/NativeScript/nativescript-angular/commit/e551df2))


### BREAKING CHANGES

* The `document` object is no longer property of the `global` object. This
may cause behavioral changes in some plugin that use the `document`
object to determine if they're running in browser context.

Fixes https://github.com/NativeScript/nativescript-angular/issues/1144.


<a name="6.0.6"></a>
## [6.0.6](https://github.com/NativeScript/nativescript-angular/compare/6.0.0...6.0.6) (2018-06-22)

> IMPORTANT! You should use this version with @angular/* v6.0.6 and up.

### Bug Fixes

* clean up properly shared modal page router outlets ([#1360](https://github.com/NativeScript/nativescript-angular/issues/1360)) ([3332ca2](https://github.com/NativeScript/nativescript-angular/commit/3332ca2))
* **animations:** inject document object in the animation engine ([#1395](https://github.com/NativeScript/nativescript-angular/issues/1395)) ([379e958](https://github.com/NativeScript/nativescript-angular/commit/379e958)), closes [#1393](https://github.com/NativeScript/nativescript-angular/issues/1393)
* **modal:** lower isModalNavigation flag when closing modal ([#1378](https://github.com/NativeScript/nativescript-angular/issues/1378)) ([6ab1cac](https://github.com/NativeScript/nativescript-angular/commit/6ab1cac))


<a name="6.0.0"></a>
# [6.0.0](https://github.com/NativeScript/nativescript-angular/compare/5.3.0...6.0.0) (2018-05-30)


### Bug Fixes

* Use cssType (uglify safe) instead typeName of for view metadata. ([d85910c](https://github.com/NativeScript/nativescript-angular/commit/d85910c))
* **modal:** closeCallback(...) should not have side effects when called multiple times ([#1349](https://github.com/NativeScript/nativescript-angular/issues/1349)) ([bffbbc2](https://github.com/NativeScript/nativescript-angular/commit/bffbbc2))
* **modal:** missing animated & stretched params ([#1293](https://github.com/NativeScript/nativescript-angular/issues/1293)) ([a9a901b](https://github.com/NativeScript/nativescript-angular/commit/a9a901b))
* **router:** state is not guarded before use ([#1331](https://github.com/NativeScript/nativescript-angular/issues/1331)) ([d27a893](https://github.com/NativeScript/nativescript-angular/commit/d27a893)), closes [/github.com/NativeScript/nativescript-angular/commit/b98da83adb3f5c51ee448fa38a51b7c65274c82e#diff-a7820fa2a2eb0ce14f3f0b8bfc666dd5R49](https://github.com//github.com/NativeScript/nativescript-angular/commit/b98da83adb3f5c51ee448fa38a51b7c65274c82e/issues/diff-a7820fa2a2eb0ce14f3f0b8bfc666dd5R49)
* **TabViewItemDirective :** textTransform property added ([#1315](https://github.com/NativeScript/nativescript-angular/issues/1315)) ([11d01f9](https://github.com/NativeScript/nativescript-angular/commit/11d01f9))


### Features

* Angular 6 support
* **router:** enable flexible page router outlets ([#1298](https://github.com/NativeScript/nativescript-angular/issues/1298)) ([b98da83](https://github.com/NativeScript/nativescript-angular/commit/b98da83))
* **testing:** Testing Components with TestBed ([#1175](https://github.com/NativeScript/nativescript-angular/issues/1175)) ([52f3ec6](https://github.com/NativeScript/nativescript-angular/commit/52f3ec6))


<a name="5.3.0"></a>
# [5.3.0](https://github.com/NativeScript/nativescript-angular/compare/5.2.0...v5.3.0) (2018-04-10)

> This version requires NativeScript 4.0.

### Bug Fixes

* **animations:** provide fake document object in both AoT and JiT mode ([#1164](https://github.com/NativeScript/nativescript-angular/issues/1164)) ([040e0e3](https://github.com/NativeScript/nativescript-angular/commit/040e0e3)), closes [#1163](https://github.com/NativeScript/nativescript-angular/issues/1163)
* App crashes on restart in android ([#1261](https://github.com/NativeScript/nativescript-angular/issues/1261)) ([331b878](https://github.com/NativeScript/nativescript-angular/commit/331b878))


### Features

* NS 4.0 Integration ([#1250](https://github.com/NativeScript/nativescript-angular/issues/1250)) ([f84fbdc](https://github.com/NativeScript/nativescript-angular/commit/f84fbdc))
* prevent core modules from getting loaded multiple times ([#1196](https://github.com/NativeScript/nativescript-angular/issues/1196)) ([010fed7](https://github.com/NativeScript/nativescript-angular/commit/010fed7))


### BREAKING CHANGES

#### Importing `NativeScriptModule` and `NativeScriptAnimationsModule` in multiple ngModules is no longer allowed.

To migrate:
 * in `AppModule`:
   * import `NativeScriptModule`
   * import`NativeScriptAnimationsModule` - only if you are planning to use Angular Animations
 * in the remaining modules:
   * remove `NativeScriptModule` imports and replace with `NativeScriptCommonModule` import
   * remove `NativeScriptAnimationsModule` imports

BEFORE:

app.module.ts:
```
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptAnimationsModule } from 'nativescript-angular/animations';
...
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptAnimationsModule
  ],
...
})
```

another.module.ts:
```
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptAnimationsModule } from 'nativescript-angular/animations';
...
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptAnimationsModule
  ],
...
})
```
 
AFTER:

app.module.ts:
```
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptAnimationsModule } from 'nativescript-angular/animations';
...
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptAnimationsModule
  ],
...
})
```

another.module.ts:
```
import { NativeScriptCommonModule } from 'nativescript-angular/common';
...
@NgModule({
  imports: [
    NativeScriptCommonModule
  ],
...
})
```

#### NativeScript 4.0 Compatible Bootstrap and Navigation
NativeScript 4.0 allows you to put any view as the root (not only Frame) of the application. To support in angular projects we had to introduce some changes in how A{N}gular apps are bootstrapped. 
    
PREVIOUS BEHAVIOR

Bootstrap creates a root `Frame` and initial `Page`. Then it bootstraps the angular application inside this page. Navigation with `<page-router-outlet>` will always navigate in the `Frame` created by the bootstrap.

Limitations:
- You cannot change the root view of the app (to `RadSideDrawer` for example). It is always the `Frame` created by the bootstrap.
- You can have only one `<page-router-outlet>` as there is only one `Frame`.
- You always have a `Page` view wrapping your components. Because the `ActionBar` is part of that `Page` you can always change it with the `<ActionBar>` component.

NEW BEHAVIOR

Bootstrap will **not** create root view by default. It will use the root view of your main application component as the root view of the application. The `<page-router-outlet>` component will create its own `Frame` and will use it for navigation. It will also wrap the components you navigate to in a `Page` and will navigate to it as it did before.

Which means:

- You can use any view for application root. Finally, you can have application-wide `RadSideDrawer`.

- You have more flexibility over where to place the `<page-router-outlet>`, you can even have more than one for more advanced scenarios.

- If you **don't use `<page-router-outlet>`** in your app you will not get the default `Page` and `Frame`, which means you will not be able to inject them in you components or show the `ActionBar`. There is special `createFrameOnBootstrap` option you can pass on bootstrap to make things as _before_:
```
platformNativeScript({ createFrameOnBootstrap: true })
    .bootstrapModuleFactory(AppModuleNgFactory);
```

- If you **are using `<page-router-outlet>`** you probably don't have to do any changes. Bootstrap will not create `Frame` and `Page`, but the outlet will do that. It will also take care of providing `Page` and so the `ActionBar` should work as _before_.


WORKING WITH FRAMES

There might be multiple frames (if you have multiple `<page-router-outlet>`'s). Angular DI works with singletons, so it will always return one instance of `Frame`. We have introduced `FrameService` (still experimental) which has a `getFrame()` method. It will return the current frame (the one you have navigated last).

#### Signature of `onAfterLivesync` changed

The signature `onAfterLivesync` observable changed from:
```
export const onAfterLivesync = new EventEmitter<NgModuleRef<any>>();
```
to:
```
export const onAfterLivesync = new EventEmitter<{ moduleRef?: NgModuleRef<any>; error?: Error }>();
```


<a name="5.2.0"></a>
# [5.2.0](https://github.com/NativeScript/nativescript-angular/compare/5.0.0...5.2.0) (2018-01-17)


### Features

* add support for Angular 5.2 ([#1154](https://github.com/NativeScript/nativescript-angular/issues/1154)) ([faa690](https://github.com/NativeScript/nativescript-angular/commit/faa690))

* enable typescript 2.6 ([#1156](https://github.com/NativeScript/nativescript-angular/issues/1156)) ([2a5742b](https://github.com/NativeScript/nativescript-angular/commit/2a5742b))



<a name="5.1.0"></a>
# [5.1.0](https://github.com/NativeScript/nativescript-angular/compare/5.0.0...5.1.0) (2018-01-10)


### Features

* add support for Angular 5.1 ([#1134](https://github.com/NativeScript/nativescript-angular/issues/1134)) ([2e944a8](https://github.com/NativeScript/nativescript-angular/commit/2e944a8))


<a name="5.0.0"></a>
# [5.0.0](https://github.com/NativeScript/nativescript-angular/compare/5.0.0-rc.0...v5.0.0) (2017-12-20)


### Features

* UI must be created before first render, drainMicroTasks when the first page is created.
This removes the white screen displayed between the launch screen and the initial page view.
Speeds up roughly 300ms startup times for iOS with Angular. ([#1103](https://github.com/NativeScript/nativescript-angular/pull/1103))


* update to Angular 5 animations and add support for AnimationBuilder ([#1114](https://github.com/NativeScript/nativescript-angular/issues/1114)) ([191f2a0](https://github.com/NativeScript/nativescript-angular/commit/191f2a0))

### DEPRECATION

NSModuleFactoryLoader is no longer needed for {N} apps. ([192a3d0](https://github.com/NativeScript/nativescript-angular/commit/192a3d0))


Before:

```
// app.module.ts

@NgModule({
    providers: [
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
        // ...
    ],
    // ...
})
class AppModule { }
```

After:

```
// app.module.ts

@NgModule({
    providers: [
        // ...
    ],
    // ...
})
class AppModule { }
```

<a name="5.0.0-rc.0"></a>
# [5.0.0-rc.0](https://github.com/NativeScript/nativescript-angular/compare/4.4.1...5.0.0-rc.0) (2017-11-06)

### Features

* Initial Angular 5.0 support ([#1073](https://github.com/NativeScript/nativescript-angular/issues/1073))



<a name="4.4.1"></a>
# [4.4.1](https://github.com/NativeScript/nativescript-angular/compare/4.4.0...4.4.1) (2017-10-13)
> This is the last version of NativeScript Angular that supports Angular 4.

### Bug Fixes

* **forms:** add base-value-accessor.ts for <4.4.0 versions compatibility (#1039) ([79e425c](https://github.com/NativeScript/nativescript-angular/commit/79e425c))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/NativeScript/nativescript-angular/compare/4.2.0...4.4.0) (2017-10-11)


### Bug Fixes

* **forms:** default to unsetValue for value accessors (#846) ([6940955](https://github.com/NativeScript/nativescript-angular/commit/6940955))
* **forms:** disable onTouch for date, number and selectedIndex value accessors (#986) ([b4b5ef6](https://github.com/NativeScript/nativescript-angular/commit/b4b5ef6)), closes [#887](https://github.com/NativeScript/nativescript-angular/issues/887)


### Features

* add `exportAs` logic for `isActive` on `routerLinkActive` directive (#940) ([147d35a](https://github.com/NativeScript/nativescript-angular/commit/147d35a))
* **Http:** expand support for request on local files (#982) ([b95184f](https://github.com/NativeScript/nativescript-angular/commit/b95184f))
* **styling:** Allow loading .css files as a fallback if no .scss file is found(#954) (#955) ([696e914](https://github.com/NativeScript/nativescript-angular/commit/696e914))
* Angular 4.4 support (#1002) ([c264453](https://github.com/NativeScript/nativescript-angular/commit/c264453))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/NativeScript/nativescript-angular/compare/3.1.3...4.2.0) (2017-08-09)

### Features

* Angular 4.2 support ([#842](https://github.com/NativeScript/nativescript-angular/issues/842)) ([eb3fd81](https://github.com/NativeScript/nativescript-angular/commit/eb3fd81))


### BREAKING CHANGES

* `NativeScriptModule` should be imported only in the root application
module (usually named `AppModule`).
All other NgModules in the app (both feature and lazy-loaded ones)
should import the `NativeScriptCommonModule` instead.
The behavior is aligned with `BrowserModule` and `CommonModule` in web
Angular apps described in [this](https://angular.io/guide/ngmodule-faq#q-browser-vs-common-module) guide.

Migration steps:
In all NgModules, except the root one (`AppModule`), replace:
```
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
…
@NgModule({
    imports: [
        NativeScriptModule,
    ]
…
})
```
with:
```
import { NativeScriptCommonModule } from "nativescript-angular/common";
…
@NgModule({
    imports: [
        NativeScriptCommonModule,
    ]
…
})
```



<a name="3.1.3"></a>
## [3.1.3](https://github.com/NativeScript/nativescript-angular/compare/3.1.2...3.1.3) (2017-07-19)


### Bug Fixes

* **action-bar:** ignore InvisibleNodes when adding title ([#903](https://github.com/NativeScript/nativescript-angular/issues/903)) ([8308e45](https://github.com/NativeScript/nativescript-angular/commit/8308e45)), closes [#897](https://github.com/NativeScript/nativescript-angular/issues/897)
* asynchronously destroy items evicted on clearHistory navigation ([#847](https://github.com/NativeScript/nativescript-angular/issues/847)) ([448412a](https://github.com/NativeScript/nativescript-angular/commit/448412a)), closes [#829](https://github.com/NativeScript/nativescript-angular/issues/829)



<a name="3.1.2"></a>
## [3.1.2](https://github.com/NativeScript/nativescript-angular/compare/3.1.1...3.1.2) (2017-07-12)


### Bug Fixes

* **renderer:** attach `CommentNode`s to visual tree ([#888](https://github.com/NativeScript/nativescript-angular/issues/888)) ([65359fa](https://github.com/NativeScript/nativescript-angular/commit/65359fa)), closes [#872](https://github.com/NativeScript/nativescript-angular/issues/872)



<a name="3.1.1"></a>
## [3.1.1](https://github.com/NativeScript/nativescript-angular/compare/3.1.0...3.1.1) (2017-06-29)


### Bug Fixes

* **forms:** add directives for formControl ([#861](https://github.com/NativeScript/nativescript-angular/issues/861)) ([#864](https://github.com/NativeScript/nativescript-angular/issues/864)) ([d29c8e1](https://github.com/NativeScript/nativescript-angular/commit/d29c8e1))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/NativeScript/nativescript-angular/compare/3.0.0...3.1.0) (2017-06-19)


### Bug Fixes

* **animations:** use parsers from core modules ([#844](https://github.com/NativeScript/nativescript-angular/issues/844)) ([1abebb6](https://github.com/NativeScript/nativescript-angular/commit/1abebb6)), closes [#738](https://github.com/NativeScript/nativescript-angular/issues/738)
* **dom-adapter:** add fake implementation for getUserAgent ([#835](https://github.com/NativeScript/nativescript-angular/issues/835)) ([743131c](https://github.com/NativeScript/nativescript-angular/commit/743131c)), closes [#831](https://github.com/NativeScript/nativescript-angular/issues/831)
* **forms:** add (touch) event and [disabled] property for controls ([#836](https://github.com/NativeScript/nativescript-angular/issues/836)) ([c8a6404](https://github.com/NativeScript/nativescript-angular/commit/c8a6404)), closes [#804](https://github.com/NativeScript/nativescript-angular/issues/804)
* **ns-router-link:** convert clearHistory string to boolean ([#834](https://github.com/NativeScript/nativescript-angular/issues/834)) ([ff99984](https://github.com/NativeScript/nativescript-angular/commit/ff99984)), closes [#832](https://github.com/NativeScript/nativescript-angular/issues/832)
* **renderer:** add styles when ViewEncapsulation is None ([#812](https://github.com/NativeScript/nativescript-angular/issues/812)) ([8d013e2](https://github.com/NativeScript/nativescript-angular/commit/8d013e2)), closes [#794](https://github.com/NativeScript/nativescript-angular/issues/794)
* **renderer:** set templateParent to comment and text nodes ([#785](https://github.com/NativeScript/nativescript-angular/issues/785)) ([b127ba7](https://github.com/NativeScript/nativescript-angular/commit/b127ba7)), closes [#777](https://github.com/NativeScript/nativescript-angular/issues/777) [#787](https://github.com/NativeScript/nativescript-angular/issues/787)
* **renderer:** stop performing value conversions ([#806](https://github.com/NativeScript/nativescript-angular/issues/806)) ([354074d](https://github.com/NativeScript/nativescript-angular/commit/354074d)), closes [#799](https://github.com/NativeScript/nativescript-angular/issues/799)

### Features

* **Modal:** allow modal to be lazily loaded from a module on demand ([#772](https://github.com/NativeScript/nativescript-angular/issues/772)) ([6a1f6a9](https://github.com/NativeScript/nativescript-angular/commit/6a1f6a9))

<a name="3.0.0"></a>
# [3.0.0](https://github.com/NativeScript/nativescript-angular/compare/v1.5.2..3.0.0) (2017-05-03)


### Bug Fixes

* **action-bar:** Don't remove action items twice. ([b96b61f](https://github.com/NativeScript/nativescript-angular/commit/b96b61f))
* **animations:** add onDestroy method to NativeScriptAnimationPlayer ([ec07ec3](https://github.com/NativeScript/nativescript-angular/commit/ec07ec3))
* **animations:** set nodeType 'element' to newly created views ([#720](https://github.com/NativeScript/nativescript-angular/issues/720)) ([8af20ad](https://github.com/NativeScript/nativescript-angular/commit/8af20ad))
* **gitignore:** Add editor files into gitignore ([9beea98](https://github.com/NativeScript/nativescript-angular/commit/9beea98))
* **init:** Bootstrap Angular on page "navigatingTo" event. ([85b9d01](https://github.com/NativeScript/nativescript-angular/commit/85b9d01))
* **list-view:** Destroy item views on unload ([71301aa](https://github.com/NativeScript/nativescript-angular/commit/71301aa))
* **list-view:** Do not access destroyed items' ng views. ([c6f7549](https://github.com/NativeScript/nativescript-angular/commit/c6f7549))
* **list-view-comp:** IterableDiffer is now parameterized on <KeyedTemplate> ([f692c5f](https://github.com/NativeScript/nativescript-angular/commit/f692c5f))
* **ns-http:** make defaultOptions of type RequestOptions ([073c95d](https://github.com/NativeScript/nativescript-angular/commit/073c95d))
* **action bar:** attach #comment nodes with _addView ([#729](https://github.com/NativeScript/nativescript-angular/issues/729)) ([0490605](https://github.com/NativeScript/nativescript-angular/commit/0490605)), closes [#725](https://github.com/NativeScript/nativescript-angular/issues/725)
* **ns-router-link:** navigate with urlTree ([#728](https://github.com/NativeScript/nativescript-angular/issues/728)) ([3c6f5ab](https://github.com/NativeScript/nativescript-angular/commit/3c6f5ab)), closes [#724](https://github.com/NativeScript/nativescript-angular/issues/724)
* use providers' map for injectors in page-router-outlet ([#744](https://github.com/NativeScript/nativescript-angular/issues/744)) ([07fe66c](https://github.com/NativeScript/nativescript-angular/commit/07fe66c)), closes [#741](https://github.com/NativeScript/nativescript-angular/issues/741)


### Code Refactoring

* stop exporting NativeScriptModule from platform ([#701](https://github.com/NativeScript/nativescript-angular/issues/701)) ([0bd2ba5](https://github.com/NativeScript/nativescript-angular/commit/0bd2ba5))


### Features

* **animations:** introduce NativeScriptAnimationsModule ([#704](https://github.com/NativeScript/nativescript-angular/issues/704)) ([f9ad6a5](https://github.com/NativeScript/nativescript-angular/commit/f9ad6a5))
* **renderer:** use EmulatedRenderer to scope component styles ([70603c4](https://github.com/NativeScript/nativescript-angular/commit/70603c4))
* **renderer:** implement createComment and createText methods using ([0f128ad](https://github.com/NativeScript/nativescript-angular/commit/0f128ad))
* **renderer:** support namespaced attributes ([#719](https://github.com/NativeScript/nativescript-angular/issues/719)) ([9b5b413](https://github.com/NativeScript/nativescript-angular/commit/9b5b413))


### BREAKING CHANGES

* **animations:** To use animations, you need to import the
NativeScriptAnimationsModule from "nativescript-angular/animations" in
your root NgModule.
* User applications cannot import NativeScriptModule from
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
