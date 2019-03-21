## Steps for testing:

- cd `nativescript-angular` and run `npm run pack`
- cd yourProj and install the tgz : `npm i <your nativescript-angular tgz>` (NOTE: tgz is in the `dist` folder)
- install `next` versions of all Angular deps
- edit `node_modules/@angular/compiler-cli/src/ngcc/src/packages/dependency_resolver.js` in order to comment out the following code:
```
    // This entry point has dependencies that are missing
    // so remove it from the graph.
    // removeNodes(entryPoint, Array.from(missing)); <--- this line
```
- enable Ivy in the tsconfig with:
```
    "angularCompilerOptions": {
        "enableIvy": true,
        "allowEmptyCodegenFiles": true,
    },
```
- run `./node_modules/.bin/ivy-ngcc`

- configure webpack to read `fesm2015` entry-points whem loading package.json:
``` 
resolve: {
    extensions: ....
    // ....
    mainFields: ['fesm2015', 'module', 'main']
},
```

- edit `fesm2015/nativescript-angular.js` in order to remove the duplicate `_0_Template`
- edit `fesm2015/nativescript-angular.js` in order to move `import 'tns-core-modules/globals'` on the first line (before `import * as ɵngcc0 from '@angular/core';`)

- fix the `nativescript-angular` imports in your app and the AOT transformer:
  - edit `/Users/tachev/Work/Test/ngIvy/node_modules/nativescript-dev-webpack/transformers/ns-replace-bootstrap.js` and set ...transformers_1.insertStarImport(sourceFile, idPlatformNativeScript, 'nativescript-angular', firstNode, true),
  - edit your main.ts, app.module.ts and everywhere else in your app in order to import from `nativescript-angular'` instead of the deep imports

- `tns run android/ios --bundle --env.aot`


## Known Issues:

- Currently the ./bin scripts are not packed in the npm package
- Zone.js distribution is modified to be TS compilable
- There are no secondary (ex. `nativescript-angular/router`) entry points for `nativescript-angular`, which is a breaking change


## Questions for Angular Team

### 1. CommonJS Support 
No support for commonJS currently. The `nativescript-angular` package is not picked up by the compatibility compiler (`ivy-ngcc`)

**Note:** We noticed that `ngcc` reads the entry-point based on `package.json` files. In the `nativescript-angular`package there are many files that can be imported directly ex. `nativescript-angular/router` or `nativescript-angular/modal-dialog` which are not separate modules and don't have a dedicated `package.json` file describing them. Is there a way to make sure **all** files in an npm package are traversed by `ngcc` when it starts to support commonjs?

### 2. Platform-specific Files in NGCC Resolver 
We tried to pack `nativescript-angular` with `ng-packger`. However, our main entry point gets ignored by the `ngcc`. The reason - it includes `tns-core-modules\application` which is plat-specific file (has `application.andorid.js` and `application.ios.js`). The `ngcc` could not resolve the import and decides to skip tha package. We patched it by commenting this line (just for the sake of spike): https://github.com/angular/angular/blob/41737bb4d3489bbfe1d2631cc1a7e9f4a732b8ff/packages/compiler-cli/ngcc/src/packages/dependency_resolver.ts#L117.
We probably need to be able to pass in custom resolver that can understand `.[android/ios].js` extension as this is a common way for defining platform-specific files in NativeScript.


### 3. Generated Compat Code Imports 
Running `ivy-ngcc` adds two imports at the start of the file:

```
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common';

import 'tns-core-modules/globals';
```
However, importing `@angular/core` before `tns-core-modules/globals` (the first import in the file) causes the following runtime crash: `ReferenceError: Can't find variable: setTimeout`. This is because `setTimeout` is defined in the global scope by `tns-core-modules/globals`. We traced the usage of `setTimeout` to here: https://github.com/angular/angular/blob/41737bb4d3489bbfe1d2631cc1a7e9f4a732b8ff/packages/core/src/render3/util/misc_utils.ts#L39-L42 
We have couple of suggestions to resolve this:

    1. Add the generated `ɵngcc0` imports after all other imports in the file. This will assure that side-effects introduced by imports are handled the same way before and after the file is converted by the `ngcc`.
    2. Have the `defaultScheduler` initialized when first needed or injected by the platform.


### 4. Generated Compat Function With Duplicating Name 
`ivy-ngcc` generate the following code just after import statements:
```
const _c0 = ["loader", ""];
const _c1 = [];
const _c2 = [4, "ngIf"];
function _0_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵprojection(0, 0, ["*ngIf", "show"]);
} }
function _0_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵprojection(0, 0, ["*ngIf", "show"]);
} }
const _c3 = ["isEmptyOutlet", "true"];
```

The function `_0_Template` is duplicated. This happens when compiling the templates for this file: https://github.com/NativeScript/nativescript-angular/blob/master/nativescript-angular/directives/platform-filters.ts . We tried splitting the file into two separate component and changing the templates to be different, but the generated code remains the same. Seems like a bug in the `ngcc`