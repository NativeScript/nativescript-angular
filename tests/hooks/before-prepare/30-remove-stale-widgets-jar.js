var path = require('path');
var shelljs = require('shelljs');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
    var projectDir = path.join(__dirname, '..', '..');
	if (!$usbLiveSyncService.isInitialized) {
        // Delete stale widgets.jar brought by old Android platforms.
        // TODO: Remove this after version 1.6.0 of the Android runtime gets released
        var androidDir = path.join(projectDir, 'platforms/android');
        var jars = shelljs.find(androidDir).filter(function(fileName){
            return fileName.match(/widgets.jar$/);
        });
        jars.forEach(function(jarFile) {
            console.log('Deleting stale jar file: ' + jarFile);
            shelljs.rm(jarFile);
        });
    }
};
