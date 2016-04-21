var fs = require("fs");
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
    var moduleOutPackageJson = path.join(moduleOutDir, "package.json");
    var packageName = "nativescript-angular-" +  require("./package.json").version + ".tgz";

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
            hookScripts: {
                cwd: 'src/nativescript-angular',
                expand: true,
                src: [
                    'postinstall.js',
                    'hooks/**/*.js'
                ],
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
        },
        shell: {
            package: {
                command: "npm pack \"" + moduleOutDir + "\""
            },
            updateTests: {
                command: "npm install ../" + packageName,
                options: {
                    execOptions: {
                        cwd: "./tests"
                    }
                }
            }
        },
    });

    grunt.registerTask("run", ['ts', 'shell:runApp']);

    grunt.registerTask("cleanAll", [
        'clean:src',
        'clean:package',
    ]);

    grunt.registerTask("package", [
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
        "copy:hookScripts",
        "add-post-install-script",
        "package"
    ]);

    grunt.registerTask("add-post-install-script", function() {
        var packageJson = JSON.parse(fs.readFileSync(moduleOutPackageJson, "utf-8"));
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.postinstall = "node postinstall.js";
        fs.writeFileSync(moduleOutPackageJson, JSON.stringify(packageJson, null, "    "));
    });

    grunt.registerTask("updateTests", ["all", "shell:updateTests"]);
    
    grunt.registerTask("default", ["all"]);
};
