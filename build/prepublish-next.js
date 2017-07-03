#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const getPackageJson = projectDir => {
    const packageJsonPath = getPackageJsonPath(projectDir);
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
};

const writePackageJson = (content, projectDir) => {
    const packageJsonPath = getPackageJsonPath(projectDir);
    fs.writeFileSync(packageJsonPath, JSON.stringify(content, null, 2))
}

const getPackageJsonPath = projectDir => path.resolve(projectDir, "package.json");

const tag = "next";
const projectDir = "nativescript-angular";
const packageJson = getPackageJson(projectDir);
const [, , packageVersion = new Date() ] = process.argv;

packageJson.publishConfig = Object.assign(
    packageJson.publishConfig || {},
    { tag }
);

delete packageJson.private;

const currentVersion = packageJson.version;
const nextVersion = `${currentVersion}-${packageVersion}`;
const newPackageJson = Object.assign(packageJson, { version: nextVersion });

writePackageJson(newPackageJson, projectDir);
