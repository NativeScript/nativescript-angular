var path = require("path");
var fs = require("fs");
var shelljs = require("shelljs");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    var nsDistPath = process.env.NSDIST || '../deps/NativeScript/bin/dist';
    var angularDistPath = process.env.ANGULARDIST || '../';

    var modulesPath = grunt.option("modulesPath", path.join(nsDistPath, 'modules'));

    var angularSrcPath = grunt.option("angularSrcPath") || "../src"

    grunt.initConfig({
        shell: {
            localInstallAngular: {
                command: "npm install \"<%= angularPackagePath %>\""
            },
            localInstallModules: {
                command: "npm install \"<%= nsPackagePath %>\""
            },
        },
    });

    grunt.registerTask("checkModules", function() {
        if (!grunt.file.exists(modulesPath)) {
            grunt.fail.fatal("Modules path does not exist.");
        }
    });

    grunt.registerTask("getNSPackage", function() {
        var packageFiles = grunt.file.expand({
            cwd: nsDistPath
        },[
            'tns-core-modules*.tgz'
        ]);
        var nsPackagePath = path.join(nsDistPath, packageFiles[0]);
        grunt.config('nsPackagePath', nsPackagePath);
    });

    grunt.registerTask("getAngularPackage", function() {
        var packageFiles = grunt.file.expand({
            cwd: angularDistPath
        },[
            'angular2-*.tgz'
        ]);
        var angularPackagePath = path.join(angularDistPath, packageFiles[0]);
        grunt.config('angularPackagePath', angularPackagePath);
    });

    grunt.registerTask("updateModules", [
        "getNSPackage",
        "shell:localInstallModules",
    ]);

    grunt.registerTask("updateAngular", [
        "getAngularPackage",
        "shell:localInstallAngular",
    ]);

    grunt.registerTask("prepare", [
        "updateModules",
        "updateAngular",
    ]);

    grunt.registerTask("default", ["prepare"]);
}
