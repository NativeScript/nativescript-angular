import { NgModule } from "@angular/core";
import { TestComponentRenderer } from "@angular/core/testing";
import { NativeScriptTestComponentRenderer } from "./src/nativescript_test_component_renderer";
import { COMMON_PROVIDERS } from "../platform-common";
import { APP_ROOT_VIEW } from "../platform-providers";
import { testingRootView } from "./src/util";
export * from "./src/util";

/**
 * Providers array is exported for cases where a custom module has to be constructed
 * to test a particular piece of code. This can happen, for example, if you are trying
 * to test dynamic component loading and need to specify an entryComponent for the testing
 * module.
 */
export const NATIVESCRIPT_TESTING_PROVIDERS: any[] = [
    COMMON_PROVIDERS,
    {provide: APP_ROOT_VIEW, useFactory: testingRootView},
    {provide: TestComponentRenderer, useClass: NativeScriptTestComponentRenderer},
];

/**
 * NativeScript testing support module. Enables use of TestBed for angular components, directives,
 * pipes, and services.
 */
@NgModule({
    providers: NATIVESCRIPT_TESTING_PROVIDERS
})
export class NativeScriptTestingModule {
}
