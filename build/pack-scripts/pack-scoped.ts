import * as path from "path";
import * as fs from "fs-extra";
import { execSync } from "child_process";

console.log(`Packing @nativescript/angular package`);

const distFolderPath = path.resolve("../../dist");
const outFileName = "nativescript-angular-scoped.tgz";

const nsAngularPackagePath = path.resolve("../../nativescript-angular");
const nsAngularPackageDistPath = path.resolve(nsAngularPackagePath + "/dist");

function getFilesFromPath(path, extension) {
  let files = fs.readdirSync( path );
  return files.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
}

// execSync(`npm install --save-exact`, {
//     cwd: nsAngularPackagePath
// });

// ensure empty temp and dist folders
fs.ensureDirSync(distFolderPath);

// create .tgz in temp folder
execSync(`cd ${nsAngularPackagePath} && npm run build.pack`);

// assume we have a single file built in temp folder, take its name
const currentFileName = getFilesFromPath(nsAngularPackageDistPath, ".tgz")[0];
console.log('currentFileName:', currentFileName);

// move built file and remove temp folder
fs.moveSync(`${nsAngularPackageDistPath}/${currentFileName}`, `${distFolderPath}/${outFileName}`, { overwrite: true });
