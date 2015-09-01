var path = require("path");

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-env');

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
                ],
                outDir: 'bin/dist/modules',
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
            reflect: {
                expand: true,
                cwd: './node_modules',
                src: [
                    'reflect-metadata/reflect-metadata.d.ts',
                ],
                dest: path.join(angularDest, 'typings')
            },
            ngSampleSrc: {
                expand: true,
                cwd: 'src/',
                src: [
                    'nativescript-angular/**/*.ts',
                ],
                dest: angularDest
            },
            nativeScriptSource: {
                expand: true,
                cwd: './deps/NativeScript',
                src: [
                    '**/*.ts',
                    '!es6-promise.d.ts',
                    '!es-collections.d.ts',
                    '!node_modules/**/*',
                    '!bin/**/*',
                ],
                dest: 'src/'
            },
        },
        clean: {
            src: {
                expand: true,
                cwd: './src',
                src: [
                    '*.ts',
                    'angular2',
                    'reflect-metadata',
                    'bin',
                    'node_modules',
                    'image-source',
                    'xml',
                    'text',
                    'data',
                    'platform',
                    'trace',
                    'fps-meter',
                    'color',
                    'application-settings',
                    'http',
                    'camera',
                    'console',
                    'timer',
                    'utils',
                    'location',
                    'build',
                    'apps',
                    'file-system',
                    'application',
                    'js-libs',
                    'globals',
                    'node-tests',
                    'ui',
                ]
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
        'clean:src',
        'copy:reflect',
        'copy:angularSource',
    ]);

    grunt.registerTask("prepare", [
        "prepareAngular",
        "shell:depNSInit",
        "copy:nativeScriptSource",
        //"ts:build",
    ]);

    grunt.registerTask("ng-sample", [
        "env:ngSample",
        "copy:reflect",
        "copy:angularSource",
        "copy:ngSampleSrc",
        "shell:ngSampleFull"
    ]);
}
