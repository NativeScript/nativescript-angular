import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

// var myArgs = process.argv.slice(2);
var scopedVersion = process.argv[2];
console.log(`Packing nativescript-angular package with @nativescript/angular: ${scopedVersion}`);

const distFolderPath = path.resolve("../../dist");
const outFileName = "nativescript-angular-compat.tgz";

const nsAngularPackagePath = path.resolve("../../nativescript-angular-package");
const packageJsonPath = path.resolve(`${nsAngularPackagePath}/package.json`);
console.log("Getting package.json from", packageJsonPath);

// rewrite dependency in package.json
const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf8" }));
packageJsonObject.dependencies["@nativescript/angular"] = scopedVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObject, null, 4));

execSync(`npm install`, {
    cwd: nsAngularPackagePath
});

// ensure empty dist folder
fs.emptyDirSync(distFolderPath);

// create .tgz
execSync(`npm pack ${nsAngularPackagePath}`, {
    cwd: distFolderPath
});

const currentFileName = fs.readdirSync(distFolderPath)[0];
// rename file
fs.moveSync(`${distFolderPath}/${currentFileName}`, `${distFolderPath}/${outFileName}`);
