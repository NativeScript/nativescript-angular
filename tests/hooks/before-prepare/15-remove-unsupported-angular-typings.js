var path = require('path');
var shelljs = require('shelljs');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
    var projectDir = path.join(__dirname, '..', '..');
    var angularModuleDir = path.join(projectDir, 'node_modules', 'angular2');
	if (!$usbLiveSyncService.isInitialized) {
        var zoneDts = path.join(angularModuleDir, 'typings', 'zone', 'zone.d.ts');
        shelljs.sed('-i', /.*reference.*path.*es6-shim.*\n/g, '', zoneDts);

        var globalsEs6Dts = path.join(angularModuleDir, 'manual_typings', 'globals-es6.d.ts');
        shelljs.sed('-i', /.*reference.*path.*node\.d\.ts.*\n/g, '', globalsEs6Dts);
    }
}
