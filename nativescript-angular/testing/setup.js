require("reflect-metadata");
require("nativescript-angular/zone-js/dist/zone-nativescript");
require("zone.js/dist/long-stack-trace-zone");
require("zone.js/dist/proxy"); // since zone.js 0.6.15
require("zone.js/dist/sync-test");
if (global.jasmine) {
    require("zone.js/dist/jasmine-patch"); // put here since zone.js 0.6.14
} 
require("zone.js/dist/async-test");
require("zone.js/dist/fake-async-test");
var testing_1 = require("@angular/platform-browser-dynamic/testing");
var destroyPlatform = require("@angular/core").destroyPlatform;
var TestBed = require("@angular/core/testing").TestBed;
var platformCommon = require("nativescript-angular/platform-common");
var platform = require("nativescript-angular/platform");
// config TestBed with TNS provider
//new platformCommon.NativeScriptPlatformRef(platform).destroy();
destroyPlatform();
TestBed.initTestEnvironment(testing_1.BrowserDynamicTestingModule, testing_1.platformBrowserDynamicTesting(platform.NS_COMPILER_PROVIDERS));