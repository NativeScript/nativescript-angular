"use strict";
var fs = require("fs");
var path = require("path");

exports.findProjectDir = function findProjectDir() {
    var candidateDir = path.join(__dirname, "..");
    while (true) {
        var oldCandidateDir = candidateDir;
        candidateDir = path.dirname(candidateDir);
        if (path.basename(candidateDir) === 'node_modules') {
            continue;
        }
        var packageJsonFile = path.join(candidateDir, 'package.json');
        if (fs.existsSync(packageJsonFile)) {
            return candidateDir;
        }
        if (oldCandidateDir === candidateDir) {
            return;
        }
    }
};

exports.getHooksDir = function getHooksDir() {
    return path.join(exports.findProjectDir(), 'hooks');
};

exports.getBeforeLivesyncHookDir = function getBeforeLivesyncHookDir() {
    return path.join(exports.getHooksDir(), "before-livesync");
};

exports.getHookFilePath = function getHookFilePath() {
    return path.join(exports.getBeforeLivesyncHookDir(), "nativescript-angular-sync.js");
};
