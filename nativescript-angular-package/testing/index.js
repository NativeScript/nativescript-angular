function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var nativescript_test_component_renderer_1 = require("./src/nativescript_test_component_renderer");
var platform_common_1 = require("../platform-common");
var platform_providers_1 = require("../platform-providers");
var util_1 = require("./src/util");
__export(require("./src/util"));
/**
 * Providers array is exported for cases where a custom module has to be constructed
 * to test a particular piece of code. This can happen, for example, if you are trying
 * to test dynamic component loading and need to specify an entryComponent for the testing
 * module.
 */
exports.NATIVESCRIPT_TESTING_PROVIDERS = [
    platform_common_1.COMMON_PROVIDERS,
    { provide: platform_providers_1.APP_ROOT_VIEW, useFactory: util_1.testingRootView },
    { provide: testing_1.TestComponentRenderer, useClass: nativescript_test_component_renderer_1.NativeScriptTestComponentRenderer },
];
/**
 * NativeScript testing support module. Enables use of TestBed for angular components, directives,
 * pipes, and services.
 */
var NativeScriptTestingModule = /** @class */ (function () {
    function NativeScriptTestingModule() {
    }
    NativeScriptTestingModule = __decorate([
        core_1.NgModule({
            providers: exports.NATIVESCRIPT_TESTING_PROVIDERS
        })
    ], NativeScriptTestingModule);
    return NativeScriptTestingModule;
}());
exports.NativeScriptTestingModule = NativeScriptTestingModule;
//# sourceMappingURL=index.js.map