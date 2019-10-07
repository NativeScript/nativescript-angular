export * from "./src/util";
/**
 * Providers array is exported for cases where a custom module has to be constructed
 * to test a particular piece of code. This can happen, for example, if you are trying
 * to test dynamic component loading and need to specify an entryComponent for the testing
 * module.
 */
export declare const NATIVESCRIPT_TESTING_PROVIDERS: any[];
/**
 * NativeScript testing support module. Enables use of TestBed for angular components, directives,
 * pipes, and services.
 */
export declare class NativeScriptTestingModule {
}
