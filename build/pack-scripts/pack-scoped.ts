import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

console.log(`Packing @nativescript/angular package`);

const distFolderPath = path.resolve("../../dist");
const tempFolderPath = path.resolve("./temp-scoped");
const outFileName = "nativescript-angular-scoped.tgz";

const nsAngularPackagePath = path.resolve("../../nativescript-angular");

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
