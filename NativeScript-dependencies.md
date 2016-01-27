Working with NativeScript dependencies
======================================

Shipping features or bug fixes for the nativescript-angular plugin sometimes requires changes to the core NativeScript framework. This document outlines a strategy for upgrading dependencies and configuring client apps.

## Depending on an unofficial NativeScript modules version

NativeScript modules are configured and built in the `deps/NativeScript` git submodule. This lets us work with changed versions locally (`ng-sample`, etc), but doesn't allow customers to test the new builds. To be able to distribute unofficial builds, we introduced the `angular` NPM tag for the `tns-core-modules` project.

Switching to an unofficial `tns-core-modules` build:

1. Checkout the correct version of the `deps/NativeScript` subrepo.
2. Modify `package.json` and change the version. We use a versioning scheme that looks like "1.6.0-angular-0". The "1.6.0" part above is the base version, and you can increment the "angular-0" part when shipping modified versions.
3. Commit the modified `package.json` and force push that to the [angular](https://github.com/NativeScript/NativeScript/tree/angular) branch.
4. Update the submodule reference to the new branch and push to master.
5. Build your tns-core-modules package.
6. CAREFUL! Publish the new versions USING THE `angular` NPM TAG: `npm publish tns-core-modules-1.6.0.tgz --tag angular`. See below if you mess things up and forget the tag part.
7. Update `nativescript-angular` package.json dependency to point to the new modules package you just published.
8. NPM publish the `nativescript-angular` package.

## Angular client app configuration

Apps need to have their package.json files set up so that they depend on the `nativescript-angular` package. It should pull the correct `x.y.z-angular-w` build from NPM.

## Fixing broken NPM publishes (forgotten angular tag)

So, you forgot the `--tag angular` part, and now everyone will get the unofficial build when s/he creates a new app now, eh? Here's how to fix it:

1. Check the NPM tags: `npm dist-tag ls tns-core-modules`
2. Switch the `latest` tag back to the correct version: `npm dist-tag add tns-core-modules@1.5.2 latest`
