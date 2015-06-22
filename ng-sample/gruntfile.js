var path = require("path");
var fs = require("fs");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var nsDistPath = process.env.NSDIST || '../nativescript/bin/dist';

    var modulesPath = grunt.option("modulesPath", path.join(nsDistPath, 'modules'));
    var typingsPath = grunt.option("typingsPath", path.join(nsDistPath, 'definitions'));

    var modulesDestPath = "app/tns_modules";
    var typingsDestPath = "src/typings/nativescript";
    var angularSrcPath = grunt.option("angularSrcPath") || "../src"

    grunt.initConfig({
        ts: {
            build: {
                src: [
                    'src/**/*.ts',
                ],
                dest: 'app',
                options: {
                    fast: "never",
                    module: "commonjs",
                    target: "es5",
                    sourceMap: true,
                    removeComments: false,
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
                    '!typings/**/*'
                ],
                dest: 'app'
            },
            modulesFiles: {
                expand: true,
                cwd: modulesPath,
                src: [
                    '**/*',
                ],
                dest: modulesDestPath
            },
            typingsFiles: {
                expand: true,
                cwd: typingsPath,
                src: [
                    '**/*',
                    '!es6-promise.d.ts',
                    '!es-collections.d.ts',
                ],
                dest: typingsDestPath
            },
            angularFiles: {
                expand: true,
                cwd: angularSrcPath,
                src: [
                    'angular2/**/*',
                    'nativescript-angular/**/*',
                ],
                dest: 'src/'
            },
            tnsifyAngular: {
                expand: true,
                cwd: 'app/',
                src: [
                    "angular2/**/*",
                    "nativescript-angular/**/*",
                ],
                dest: 'app/tns_modules',
            },
            tnsifyNpmDeps: {
                expand: true,
                cwd: 'node_modules/',
                src: [
                    "reflect-metadata/**/*",
                    "rtts_assert/**/*",
                    "zone.js/**/*",
                    "rx/**/*",
                    "parse5/**/*",
                    "punycode/**/*",
                    "querystring/**/*",
                    "url/**/*",
                ],
                dest: 'app/tns_modules',
            },
        },
    });

    grunt.registerTask("removeAppDir", function() {
        grunt.file.delete("app");
    });

    grunt.registerTask("removeNSFiles", function() {
        grunt.file.delete(typingsDestPath);
    });

    grunt.registerTask("checkModules", function() {
        if (!grunt.file.exists(modulesPath)) {
            grunt.fail.fatal("Modules path does not exist.");
        }
    });

    grunt.registerTask("checkTypings", function() {
        if (!grunt.file.exists(typingsPath)) {
            grunt.fail.fatal("Typings path does not exist.");
        }
    });

    grunt.registerTask("checkAngular", function() {
        if (!grunt.file.exists(path.join(angularSrcPath, 'angular2'))) {
            grunt.fail.fatal("angular2 path does not exist.");
        }
        if (!grunt.file.exists(path.join(angularSrcPath, 'nativescript-angular'))) {
            grunt.fail.fatal("nativescript-angular path does not exist.");
        }
    });

    grunt.registerTask("app", [
        "copy:appFiles",
        "ts:build",
        "prepareTnsModules",
    ]);

    grunt.registerTask("app-full", [
        "clean",
        "updateTypings",
        "updateModules",
        "updateAngular",
        "app",
    ]);

    grunt.registerTask("updateModules", [
        "checkModules",
        "copy:modulesFiles",
    ]);

    grunt.registerTask("updateTypings", [
        "checkTypings",
        "copy:typingsFiles",
    ]);

    grunt.registerTask("updateAngular", [
        "checkAngular",
        "copy:angularFiles",
    ]);

    grunt.registerTask("prepareQuerystringPackage", function() {
        //The {N} require doesn't look for index.js automatically
        //so we need to declare it as main
        var packagePath = "app/tns_modules/querystring/package.json";

        var packageData = grunt.file.readJSON(packagePath);
        packageData.main = './index.js';
        grunt.file.write(packagePath, JSON.stringify(packageData, null, 4));
    });

    grunt.registerTask("prepareTnsModules", [
        "copy:tnsifyAngular",
        "copy:tnsifyNpmDeps",
        "prepareQuerystringPackage",
    ]);

    grunt.registerTask("clean", [
        "removeAppDir",
        "removeNSFiles",
    ]);
}
