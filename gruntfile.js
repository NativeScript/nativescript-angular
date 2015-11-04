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
    
    var shellPackageCommand = ''
    if (process.platform === 'win32') {
        shellPackageCommand = "npm pack " + moduleOutDir;
    } else {
        shellPackageCommand = "npm pack '" + moduleOutDir + "'";
    }

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

                    // Resolve non-relative modules like "ui/styling/style"
                    // based on the project root (not on node_modules which
                    // is the typescript 1.6+ default)
                    additionalFlags: '--moduleResolution classic',

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
                cwd: './deps/angular/modules',
                src: [
                    'angular2/**/*',
                    '!angular2/**/*.dart',
                    '!angular2/test/**/*',
                    '!angular2/angular2_sfx*',
                    '!angular2/router*',
                    '!angular2/src/router/**/*',
                    '!angular2/src/mock/**/*',
                    '!angular2/mock.ts',
                    '!angular2/docs/**/*',
                    '!angular2/test*',
                    '!angular2/src/test_lib/**/*',
                    '!angular2/src/testing/**/*',

                    '!angular2/typings/*protractor*/**/*',
                    '!angular2/typings/es6-shim/**/*',
                    '!angular2/typings/jasmine/**/*',
                    '!angular2/typings/node/**/*',
                    '!angular2/typings/*selenium*/**/*',
                    '!angular2/typings/tsd.d.ts',

                    '!angular2/manual_typings/**/*',
                    '!angular2/examples/**/*',
                    '!angular2/web_worker/**/*',
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
                command: shellPackageCommand
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
        'fixAngularTsdDts'
    ]);

    function removeUnneededTypings(relativePath) {
        var tsdFile = path.join(angularDest, relativePath);

        shelljs.sed('-i', /.*protractor.*\n/g, '', tsdFile);
        shelljs.sed('-i', /.*jasmine.*\n/g, '', tsdFile);
        shelljs.sed('-i', /.*selenium.*\n/g, '', tsdFile);
        shelljs.sed('-i', /.*node\.d\.ts.*\n/g, '', tsdFile);
    }

    grunt.registerTask("fixAngularTsdDts", function() {
        //removeUnneededTypings('angular2/typings/tsd.d.ts');
        //removeUnneededTypings('angular2/manual_typings/globals-es6.d.ts');
    });

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
        "build"
    ]);

    grunt.registerTask("build", [
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
