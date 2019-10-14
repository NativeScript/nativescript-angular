import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

// var myArgs = process.argv.slice(2);
var scopedVersion = process.argv[2];
console.log(`Packing nativescript-angular package with @nativescript/angular: ${scopedVersion}`);

const distFolderPath = path.resolve("../../dist");
const tempFolderPath = path.resolve("./temp-compat");
const outFileName = "nativescript-angular-compat.tgz";

const nsAngularPackagePath = path.resolve("../../nativescript-angular-package");
const packageJsonPath = path.resolve(`${nsAngularPackagePath}/package.json`);
console.log("Getting package.json from", packageJsonPath);

// rewrite dependency in package.json
const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf8" }));
packageJsonObject.dependencies["@nativescript/angular"] = scopedVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObject, null, 4));

execSync(`npm install --save-exact`, {
    cwd: nsAngularPackagePath
});

// ensure empty temp and dist folders
fs.emptyDirSync(tempFolderPath);
fs.emptyDirSync(distFolderPath);

// create .tgz in temp folder
execSync(`npm pack ${nsAngularPackagePath}`, {
    cwd: tempFolderPath
});

// assume we have a single file built in temp folder, take its name
const currentFileName = fs.readdirSync(tempFolderPath)[0];

// move built file and remove temp folder
fs.moveSync(`${tempFolderPath}/${currentFileName}`, `${distFolderPath}/${outFileName}`);
fs.removeSync(`${tempFolderPath}`);
