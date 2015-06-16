var path = require("path");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var nsDistPath = process.env.NSDIST || '../nativescript/bin/dist';

    var modulesPath = grunt.option("modulesPath", path.join(nsDistPath, 'modules'));
    var typingsPath = grunt.option("typingsPath", path.join(nsDistPath, 'definitions'));

    var modulesDestPath = "app/tns_modules";
    var typingsDestPath = "src/typings/nativescript";

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
                ],
                dest: typingsDestPath
            }
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

    grunt.registerTask("app", [
        "ts:build",
        "copy:appFiles",
    ]);

    grunt.registerTask("app-full", [
        "clean",
        "copy:appFiles",
        "updateTypings",
        "updateModules",
        "ts:build",
    ]);

    grunt.registerTask("updateModules", [
        "checkModules",
        "copy:modulesFiles",
    ]);

    grunt.registerTask("updateTypings", [
        "checkTypings",
        "copy:typingsFiles",
    ]);

    grunt.registerTask("clean", [
        "removeAppDir",
        "removeNSFiles",
    ]);
}
