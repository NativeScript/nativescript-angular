var execSync = require('child_process').execSync;

module.exports = function($logger, $projectData, $usbLiveSyncService) {
    if (!$usbLiveSyncService.isInitialized) {
        execSync("npm run updateTests", { stdio: [0, 1, 2]});
    }
}
