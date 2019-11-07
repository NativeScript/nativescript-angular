import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

/**
 * Use this script to pack .tgz for nativescript-angular package. The first passed param can be:
 * 1. Path to .tgz file - in this case the script replaces the scoped dependency (@nativescript/angular) with it in the package.json file. Then packs.
 * 2. Tag or exact version - in this case the script does `npm install --save-exact` to save the exact version (in case if tag). Then packs.
 * 3. `auto-version` - this is interpreted by getting version from the scoped package.json file (nativescript-angular folder).
 */

var scopedVersion = process.argv[2];

console.log(`Packing nativescript-angular package with @nativescript/angular: ${scopedVersion}`);

const distFolderPath = path.resolve("../../dist");
const tempFolderPath = path.resolve("./temp-compat");
const outFileName = "nativescript-angular-compat.tgz";

const nsAngularScopedPackageJSONPath = path.resolve("../../nativescript-angular/package.json");
const nsAngularPackagePath = path.resolve("../../nativescript-angular-package");
const packageJsonPath = path.resolve(`${nsAngularPackagePath}/package.json`);
console.log("Getting package.json from", packageJsonPath);


function prepareCompatPackageJSON(scopedVersion: string) {
    const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf8" }));
    packageJsonObject.dependencies["@nativescript/angular"] = scopedVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObject, null, 4));
}

if (scopedVersion === "auto-version") {
    // We use this when build for release. In this case we need to get version from scoped package (nativescript-angular) 
    // and use it in the compat package.

    scopedVersion = JSON.parse(fs.readFileSync(nsAngularScopedPackageJSONPath, { encoding: "utf8" })).version;
    prepareCompatPackageJSON(scopedVersion)
} else {
    let npmInstallParams = "";

    if (scopedVersion.indexOf(".tgz") > 0) {
        // If building with .tgz, we need to update the package.json of the compat package 
        prepareCompatPackageJSON(scopedVersion)
    } else {
        // If building with tag or exact version, just install it with --save-exact
        npmInstallParams = `@nativescript/angular@${scopedVersion}`;
    }  

    execSync(`npm install --save-exact ${npmInstallParams}`, {
        cwd: nsAngularPackagePath
    });
} 

// ensure empty temp and existing dist folders
fs.emptyDirSync(tempFolderPath);
fs.ensureDirSync(distFolderPath);

// Install, run tsc and run ngc
execSync(`npm i && npm run tsc && npm run ngc`, {
    cwd: nsAngularPackagePath
});

// create .tgz in temp folder
execSync(`npm pack ${nsAngularPackagePath}`, {
    cwd: tempFolderPath
});

// assume we have a single file built in temp folder, take its name
const currentFileName = fs.readdirSync(tempFolderPath)[0];

// move built file and remove temp folder
fs.moveSync(`${tempFolderPath}/${currentFileName}`, `${distFolderPath}/${outFileName}`, { overwrite: true });
fs.removeSync(`${tempFolderPath}`);
