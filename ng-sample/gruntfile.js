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
        ts: {
            build: {
                src: [
                    'src/**/*.ts',
                    // This one refers to the Angular package structure from npm
                    // and doesn't compile against the dev source.
                    '!src/nativescript-angular/application.d.ts',
                ],
                dest: 'app',
                options: {
                    fast: "never",
                    module: "commonjs",
                    target: "es5",
                    sourceMap: true,
                    removeComments: false,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    compiler: "node_modules/typescript/bin/tsc",
                    noEmitOnError: true
                },
            },
        },
        copy: {
            appFiles: {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*',
                    '!**/*.ts',
                ],
                dest: 'app'
            },
            rendererFiles: {
                expand: true,
                cwd: '../src',
                src: [
                    'nativescript-angular/**/*',
                    'global.d.ts',
                ],
                dest: 'src'
            },
        },
        shell: {
            localInstallAngular: {
                command: "npm install \"<%= angularPackagePath %>\""
            },
            localInstallModules: {
                command: "npm install \"<%= nsPackagePath %>\""
            },
        },
        clean: {
            appBeforeDeploy: {
                expand: true,
                cwd: './app',
                src: [
                    'angular2',
                    'nativescript-angular',
                    'css',
                    '**/*.js.map',
                ]
            },
        }
    });

    grunt.registerTask("removeAppDir", function() {
        grunt.file.delete("app");
    });

    grunt.registerTask("checkModules", function() {
        if (!grunt.file.exists(modulesPath)) {
            grunt.fail.fatal("Modules path does not exist.");
        }
    });

    grunt.registerTask("app", [
        "copy:rendererFiles",
        "ts:build",
        "copy:appFiles",
        "preDeploy",
    ]);

    grunt.registerTask("app-full", [
        "full-clean",
        "app",
    ]);

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

    grunt.registerTask("prepareQuerystringPackage", function() {
        //The {N} require doesn't look for index.js automatically
        //so we need to declare it as main
        var packagePath = "node_modules/querystring/package.json";

        var packageData = grunt.file.readJSON(packagePath);
        packageData.main = './index.js';
        grunt.file.write(packagePath, JSON.stringify(packageData, null, 4));
    });

    grunt.registerTask("prepare", [
        "updateModules",
        "updateAngular",
        "prepareQuerystringPackage",
    ]);

    grunt.registerTask("preDeploy", [
    ]);

    grunt.registerTask("full-clean", [
        "removeAppDir",
    ]);
}
