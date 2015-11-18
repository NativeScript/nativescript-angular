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

    var ngSampleSubDir = {
        execOptions: {
            cwd: 'ng-sample',
        }
    };

    var nsSubDir = {
        execOptions: {
            cwd: 'deps/NativeScript',
        }
    };

    var angularSubDir = {
        execOptions: {
            cwd: 'deps/angular',
        }
    };

    grunt.initConfig({
        ts: {
            build: {
                src: [
                    'src/**/*.ts',
                    //public API d.ts using the official angular package structure
                    '!src/nativescript-angular/application.d.ts',
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
            depNSInit: {
                command: [
                    'npm install',
                    'grunt --no-runtslint',
                ].join('&&'),
                options: nsSubDir
            },
            package: {
                command: "npm pack \"" + moduleOutDir + "\""
            },
            installAngularDependencies: {
                command: 'npm install',
                options: angularSubDir
            },
            compileAngular: {
                command: 'gulp build.js.cjs',
                options: angularSubDir
            },
            buildAngularPackage: {
                command: 'npm pack deps/angular/dist/js/cjs/angular2',
            },
            installAngularPackage: {
                command: 'npm install angular2-*.tgz',
            }
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

    grunt.registerTask("installAngular", [
        "shell:installAngularDependencies",
        "shell:compileAngular",
        "shell:buildAngularPackage",
        "shell:installAngularPackage",
    ]);

    grunt.registerTask("prepare", [
        "cleanAll",
        "installAngular",
        "shell:depNSInit",
        "build"
    ]);

    grunt.registerTask("build", [
        "ts:build",
        "copy:packageJson",
        "package"
    ]);

    grunt.registerTask("default", ["prepare"]);
};
