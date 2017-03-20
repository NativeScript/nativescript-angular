var fs = require("fs");
var os = require("os");
var path = require("path");
var hookHelper = require("./hooks/hook-helper");
var projectDir = hookHelper.findProjectDir();

if (projectDir) {
    var bundlePath = path.join(projectDir, "node_modules/@angular/animations/browser/package.json");

    try {
        var content = require(bundlePath);
        content.main = "../bundles/animations-browser.umd.js";
        console.log(content)
        fs.writeFileSync(bundlePath, JSON.stringify(content), "utf8");
    } catch(e) {
        console.error(e.message);
    }

    var hooksDir = hookHelper.getHooksDir(),
        beforeLivesyncHookDir = hookHelper.getBeforeLivesyncHookDir(),
        content = 'module.exports = require("nativescript-angular/hooks/before-livesync");';
    if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir);
    }
    if (!fs.existsSync(beforeLivesyncHookDir)) {
        fs.mkdirSync(beforeLivesyncHookDir);
    }
    fs.writeFileSync(hookHelper.getHookFilePath(), content + os.EOL);
}
