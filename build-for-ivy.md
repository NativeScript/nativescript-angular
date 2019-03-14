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