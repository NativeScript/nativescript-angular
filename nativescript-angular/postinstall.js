var fs = require("fs");
var os = require("os");
var hookHelper = require("./hooks/hook-helper");
var projectDir = hookHelper.findProjectDir();

if (projectDir) {
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
