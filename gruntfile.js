var path = require("path");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-env');

    var outDir = "bin/dist/modules";
    var moduleOutDir = path.join(outDir, "nativescript-angular");

    var runEnv = JSON.parse(JSON.stringify(process.env));
    runEnv['NODE_PATH'] = 'bin/dist/modules';

    var angularDest = grunt.option('angularDest') || 'src/';
    console.log(angularDest);

    var ngSampleSubDir = {
        execOptions: {
            cwd: 'ng-sample',
        }
    }

    var nsSubDir = {
        execOptions: {
            cwd: 'deps/NativeScript',
        }
    }


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
            angularSource: {
                expand: true,
                rename: function(dest, src) {
                    if (/\.js$/i.test(src)) {
                        return dest + src.substring(0, src.length - 3) + '.ts';
                    }
                    if (/\.es6$/i.test(src)) {
                        return dest + src.substring(0, src.length - 4) + '.ts';
                    }
                    return dest + src;
                },
                cwd: './deps/angular/modules',
                src: [
                    'angular2/**/*',
                    '!angular2/test/**/*',
                    '!angular2/angular2_sfx*',
                    '!angular2/router*',
                    '!angular2/src/router/**/*',
                    '!angular2/src/mock/**/*',
                    '!angular2/mock.ts',
                    '!angular2/docs/**/*',
                    '!angular2/test*',
                    '!angular2/src/test_lib/**/*',
                    '!angular2/typings/angular-protractor/**/*',
                    '!angular2/typings/node/**/*',
                    //'!angular2/typings/es6-promise/**/*',
                    '!angular2/typings/jasmine/**/*',
                    //'!angular2/typings/hammerjs/**/*',
                    '!angular2/typings/selenium-webdriver/**/*',
                ],
                dest: angularDest
            },
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
            ngSampleSrc: {
                expand: true,
                cwd: 'src/',
                src: [
                    'nativescript-angular/**/*.ts',
                ],
                dest: angularDest
            },
        },
        clean: {
            src: {
                expand: true,
                cwd: './src',
                src: [
                    '*.ts',
                    '!dependencies.d.ts',
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
            ngSampleFull: {
                command: 'grunt app-full',
                options: ngSampleSubDir
            },
            ngSampleInit: {
                command: [
                    'npm install',
                    'tns platform add android',
                ].join('&&'),
                options: ngSampleSubDir
            },
            depNSInit: {
                command: [
                    'npm install',
                    'grunt --no-runtslint',
                ].join('&&'),
                options: nsSubDir
            },
            package: {
                command: "npm pack '" + moduleOutDir + "'"
            }
        },
        env: {
            ngSample: {
                NSDIST: '../deps/NativeScript/bin/dist',
            }
        }
    });

    grunt.registerTask("run", ['ts', 'shell:runApp']);

    grunt.registerTask("prepareAngular", [
        'copy:angularSource',
    ]);

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

    grunt.registerTask("prepare", [
        "cleanAll",
        "prepareAngular",
        "shell:depNSInit",
        "ts:build",
        "copy:packageJson",
        "package"
    ]);

    grunt.registerTask("ng-sample", [
        "env:ngSample",
        "copy:angularSource",
        "copy:ngSampleSrc",
        "shell:ngSampleFull"
    ]);

    grunt.registerTask("default", ["prepare"]);
}
