//import "globals";
// import "./modules";
//global.registerModule("./main-page", function () { return require("./main-page"); });

//import * as profiling from "./profiling";
//profiling.start('application-start');

// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { nativeScriptBootstrap } from "./nativescript-angular/application";

//import {RendererTest} from './examples/renderer-test';
//import {Benchmark} from './performance/benchmark';
//import {ListTest} from './examples/list/list-test';
import {ListTestAsync} from "./examples/list/list-test-async";

//nativeScriptBootstrap(RendererTest);
//nativeScriptBootstrap(Benchmark);
//nativeScriptBootstrap(ListTest);
nativeScriptBootstrap(ListTestAsync);
