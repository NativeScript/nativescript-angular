var path = require("path");
var shelljs = require("shelljs");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-env');

    var outDir = "bin/dist/modules";
    var moduleOutDir = path.join(outDir, "nativescript-angular");

    grunt.initConfig({
        ts: {
            build: {
                src: [
                    'src/**/*.ts',
                ],
                outDir: outDir,
                options: {
                    fast: 'never',
                    module: "commonjs",
                    target: "es5",
                    sourceMap: true,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    declaration: true,
                    removeComments: false,
                    compiler: "node_modules/typescript/bin/tsc",
                    noEmitOnError: true
                },
            },
        },
        copy: {
            packageJson: {
                expand: true,
                src: 'package.json',
                dest: moduleOutDir
            },
            npmReadme: {
                expand: true,
                src: 'README.md',
                cwd: 'doc',
                dest: moduleOutDir
            },
            handCodedDefinitions: {
                src: '**/*.d.ts',
                cwd: 'src/nativescript-angular',
                expand: true,
                dest: moduleOutDir
            },
        },
        clean: {
            src: {
                expand: true,
                cwd: './src',
                src: [
                    '*.ts',
                    '!dependencies.d.ts',
                    '!global.d.ts',
                    'angular2',
                ]
            },
            package: {
                src: 'nativescript-angular*.tgz'
            },
            packageDefinitions: {
                src: moduleOutDir + '/**/*.d.ts'
            }
        },
        shell: {
            package: {
                command: "npm pack \"" + moduleOutDir + "\""
            },
        },
    });

    grunt.registerTask("run", ['ts', 'shell:runApp']);

    grunt.registerTask("cleanAll", [
        'clean:src',
        'clean:package',
    ]);

    grunt.registerTask("package", [
        "clean:packageDefinitions",
        "copy:handCodedDefinitions",
        "copy:npmReadme",
        "shell:package",
    ]);

    grunt.registerTask("all", [
        "cleanAll",
        "build"
    ]);

    grunt.registerTask("build", [
        "ts:build",
        "copy:packageJson",
        "package"
    ]);

    grunt.registerTask("default", ["all"]);
};
