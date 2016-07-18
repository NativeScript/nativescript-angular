#!/usr/bin/env node

var fsModule = require('fs');

//Adds a publishConfig section to the package.json file
// and sets a tag to it

var path = './package.json';
var fileOptions = {encoding: "utf-8"};
var content = fsModule.readFileSync(path, fileOptions);

var tag = process.argv[2];
if (!tag) {
    console.log('Please pass the tag name as an argument!');
    process.exit(1);
}

var packageDef = JSON.parse(content);
if (!packageDef.publishConfig) {
    packageDef.publishConfig = {};
}
packageDef.publishConfig.tag = tag;

if (packageDef.private) {
    delete packageDef.private;
}

// adding date and travis build number (2016-07-18-765) to version in order to get unique version for @next build
var package_version = process.argv[3];
packageDef.version += '-' + package_version;

var newContent = JSON.stringify(packageDef, null, '  ');
fsModule.writeFileSync(path, newContent, fileOptions);
