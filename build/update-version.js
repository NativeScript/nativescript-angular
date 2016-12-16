// updates version of package.json
// usage node update-version.js es6 -> will make version from "1.3.0" to "1.3.0-es6"
// node update-version.js -> will make version from "1.3.0-es6" or "1.3.0" to "1.3.0"

var fs = require("fs");
var path = require("path");
var os = require("os");
//console.log(`dirname -> ${__dirname}`);
var packageFileName = path.join(__dirname, "../nativescript-angular/package.json");
//console.log(`packageFileName -> ${packageFileName}`);
var package = require(packageFileName);
var versionRegex = /^([~,\^]*\d+\.\d+\.\d+)/;

var currentVersion = package.version.match(versionRegex);

//console.log(`currentVersion -> ${currentVersion}`);

if (currentVersion.length > 0) {
    if (process.argv[2]) {
        package.version = `${currentVersion[1]}-${process.argv[2]}`;
    } else {
        package.version = `${currentVersion[1]}`;
    }
    fs.writeFileSync(packageFileName, JSON.stringify(package, null, 2) + os.EOL);
}
