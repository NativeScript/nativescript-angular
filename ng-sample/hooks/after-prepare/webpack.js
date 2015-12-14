var path = require("path");
var shelljs = require("shelljs");

module.exports = function (logger, platformsData, projectData, hookArgs) {
    var platformData = platformsData.getPlatformData(hookArgs.platform.toLowerCase());
    var outDir = platformData.appDestinationDirectoryPath;
    console.log('outDir: ' + outDir);
    console.log('pwd: ' + shelljs.pwd());

    return new Promise(function (resolve, reject) {
        return shelljs.exec("webpack", function(code, output) {
            if (code == 0) {
                //shelljs.rm("-rf", path.join(outDir, "app", "*"))
                shelljs.rm("-rf", path.join(outDir, "app", "main-page*"))
                shelljs.mv("bundle.js", path.join(outDir, "app", "index.js"))

                resolve();
            } else {
                console.log('webpack failed.');
                reject();
            }
        });
    });
}
