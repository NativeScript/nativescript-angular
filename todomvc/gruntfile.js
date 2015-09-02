var path = require("path");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

    var nsDistPath = process.env.NSDIST || '../deps/NativeScript/bin/dist';

    var modulesPath = grunt.option("modulesPath", path.join(nsDistPath, 'modules'));
    var typingsPath = grunt.option("typingsPath", path.join(nsDistPath, 'definitions'));
    var angularSrcPath = grunt.option("angularSrcPath") || "../src"
    var rendererPath = grunt.option("rendererPath") || "../bin/dist/modules/nativescript-angular";

    var modulesDestPath = "app/tns_modules";
    var typingsDestPath = "src/typings/nativescript";

    var androidAvd = grunt.option('avd') || "nexus"
    var genyDevice = grunt.option('geny') || "nexus7"
    var iOSDevice = grunt.option('device') || "nexus"

    grunt.initConfig({
        ts: {
            build: {
                src: [
                    'src/**/*.ts',
                    //'!src/**/*ios.ts',
                    //'!src/**/*ios.d.ts',
                    //'!src/ios.d.ts',
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
                    '!typings',
                ],
                dest: 'app'
            },
            typingsFiles: {
                expand: true,
                cwd: typingsPath,
                src: [
                    '**/*.d.ts',
                    '!node-tests/**/*',
                    '!es6-promise.d.ts',
                    //'!es-collections.d.ts',
                ],
                dest: typingsDestPath
            },
            modulesFiles: {
                expand: true,
                cwd: modulesPath,
                src: [
                    '**/*',
                    '!**/*.tgz',
                    '!node_modules',
                    '!node_modules/**/*',
                ],
                dest: modulesDestPath
            },
            rendererFiles: {
                expand: true,
                cwd: rendererPath,
                src: [
                    '**/*',
                ],
                dest: path.join(modulesDestPath, 'nativescript-angular')
            },
            iosStub: {
                expand: true,
                cwd: path.join(nsDistPath, '..', '..'),
                src: [
                    'ios-stub.ts',
                ],
                dest: typingsDestPath
            },
        },
        shell: {
            emulateGeny: {
                command: "tns emulate android --geny '" + genyDevice +"'"
            },
            emulateAndroid: {
                command: "tns emulate android --avd '" + androidAvd +"'"
            },
            emulateIOS: {
                command: "tns emulate ios --device '" + iOSDevice +"'"
            }

        }
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
        if (!grunt.file.exists(path.join(angularSrcPath, 'nativescript-angular'))) {
            grunt.fail.fatal("nativescript-angular path does not exist.");
        }
    });

    grunt.registerTask("updateModules", [
        "checkModules",
        "copy:modulesFiles",
    ]);

    grunt.registerTask("updateRenderer", [
        "copy:rendererFiles",
    ]);

    grunt.registerTask("updateTypings", [
        "checkTypings",
        "copy:typingsFiles",
        //"copy:iosStub",
    ]);

    grunt.registerTask("removeAppDir", function() {
        grunt.file.delete("app");
    });

    grunt.registerTask("removeTraceurPackage", function() {
        var traceurPath = 'node_modules/angular2/node_modules/traceur';
        if (grunt.file.isDir(traceurPath))
            grunt.file.delete(traceurPath);
    });

    grunt.registerTask("app", [
        "checkAngular",
        "copy:appFiles",
        "ts:build",
    ]);

    grunt.registerTask("app-full", [
        "clean",
        "updateTypings",
        "updateModules",
        "updateRenderer",
        "app",
    ]);

    grunt.registerTask("run-android", ["app", "shell:emulateAndroid"])
    grunt.registerTask("run-ios", ["app", "shell:emulateIOS"])

    grunt.registerTask("clean", [
        "removeAppDir",
        "removeTraceurPackage"
    ]);
}
