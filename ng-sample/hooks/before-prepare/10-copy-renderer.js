var path = require('path');
var shelljs = require('shelljs');

module.exports = function() {
    shelljs.cp('-Rf', '../src/nativescript-angular', 'app');
    shelljs.cp('-Rf', '../src/global.d.ts', 'app');
}
