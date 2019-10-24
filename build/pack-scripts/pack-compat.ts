import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

// var myArgs = process.argv.slice(2);
var scopedVersion = process.argv[2];
var skipInstall = process.argv[3];
console.log(`Packing nativescript-angular package with @nativescript/angular: ${scopedVersion}`);

const distFolderPath = path.resolve("../../dist");
const tempFolderPath = path.resolve("./temp-compat");
const outFileName = "nativescript-angular-compat.tgz";

const nsAngularPackagePath = path.resolve("../../nativescript-angular-package");
const packageJsonPath = path.resolve(`${nsAngularPackagePath}/package.json`);
console.log("Getting package.json from", packageJsonPath);

let npmInstallParams = "";

if (scopedVersion.indexOf(".tgz") > 0 || skipInstall === "no-save-exact") {
    // rewrite dependency in package.json
    const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf8" }));
    packageJsonObject.dependencies["@nativescript/angular"] = scopedVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObject, null, 4));
} else {
    npmInstallParams = `@nativescript/angular@${scopedVersion}`;
}

if (skipInstall !== "no-save-exact") {
    execSync(`npm install --save-exact ${npmInstallParams}`, {
        cwd: nsAngularPackagePath
    });
}

// ensure empty temp and existing dist folders
fs.emptyDirSync(tempFolderPath);
fs.ensureDirSync(distFolderPath);

// Install, run tsc and run ngc
execSync(`npm i && tsc && npm run ngc`, {
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
