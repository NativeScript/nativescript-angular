var path = require('path');
var shelljs = require('shelljs');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
    var projectDir = path.join(__dirname, '..', '..');
    var appDir = path.join(projectDir, 'app');
    var srcDir = path.join(projectDir, '..', 'src');
    if (!$usbLiveSyncService.isInitialized) {
        shelljs.cp('-Rf', path.join(srcDir, 'nativescript-angular'), appDir);
        shelljs.cp('-Rf', path.join(srcDir, 'global.d.ts'), appDir);
    }
}
