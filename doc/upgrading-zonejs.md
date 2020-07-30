# Upgrading Zone.js

`nativescript-angular` uses a fork of the `zone.js` package in order to work around incompatibilities between node, browser, and mobile implementations.

The fork resides at https://github.com/NativeScript/zone.js in the `zone-nativescript` branch. It adds a separate `lib/nativescript/nativescript.ts` entry point that is used to generate a new bundle: `zone-nativescript.js`.

To upgrade to a newer release of `zone.js`:

1. Identify the upgrade target -- most likely a release tag.
2. Rebase the `zone-nativescript` branch on top of the upgrade target.
3. Rebuild: `gulp build`
4. Run the node-based smoke tests: `gulp test/nativescript`
5. Run the browser tests: `node_modules/.bin/karma start karma.conf.js --single-run` (You need to run node `test/ws-server.js` in a separate console first)
6. Commit `zone-nativescript.js`, drop the previous `zone-nativescript.js` commit from the branch. Force push the new `zone-nativescript` branch to GitHub.
7. Update your copy of `nativescript-angular/zone.js/dist/zone-nativescript.js` with the bundle you just built.
