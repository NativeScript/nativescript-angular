var path = require('path');
var shelljs = require('shelljs');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
    console.log(arguments);
    console.log('LIVESYNC: ' + $usbLiveSyncService.isInitialized);
    if (!$usbLiveSyncService.isInitialized) {
        shelljs.cp('-Rf', '../src/nativescript-angular', 'app');
        shelljs.cp('-Rf', '../src/global.d.ts', 'app');
    }
}
