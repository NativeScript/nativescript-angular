Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var testing_1 = require("@angular/core/testing");
var core_1 = require("@angular/core");
var nativescript_module_1 = require("../../nativescript.module");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
var platform_1 = require("../../platform");
var index_1 = require("../index");
var common_1 = require("@angular/common");
var grid_layout_1 = require("tns-core-modules/ui/layouts/grid-layout");
var TESTING_ROOT_ID = "__testing_container";
/**
 * Get a reference to the fixtures container.
 */
function testingRootView() {
    var rootPageLayout = frame_1.topmost().currentPage.content;
    var testingRoot;
    rootPageLayout.eachChild(function (child) {
        if (child.id === TESTING_ROOT_ID) {
            testingRoot = child;
            return false;
        }
        return true;
    });
    if (!testingRoot) {
        testingRoot = new grid_layout_1.GridLayout();
        testingRoot.id = TESTING_ROOT_ID;
        grid_layout_1.GridLayout.setColumnSpan(testingRoot, 100);
        grid_layout_1.GridLayout.setRowSpan(testingRoot, 100);
        rootPageLayout.addChild(testingRoot);
    }
    return testingRoot;
}
exports.testingRootView = testingRootView;
/**
 * Declared test contexts. When the suite is done this map should be empty if all lifecycle
 * calls have happened as expected.
 * @private
 */
var activeTestFixtures = [];
/**
 * Return a promise that resolves after (durationMs) milliseconds
 */
function promiseWait(durationMs) {
    return function () { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, durationMs); }); };
}
exports.promiseWait = promiseWait;
/**
 * Perform basic TestBed environment initialization. Call this once in the main entry point to your tests.
 */
function nsTestBedInit() {
    testing_1.TestBed.initTestEnvironment(index_1.NativeScriptTestingModule, testing_2.platformBrowserDynamicTesting(platform_1.NS_COMPILER_PROVIDERS));
}
exports.nsTestBedInit = nsTestBedInit;
/**
 * Helper for configuring a TestBed instance for rendering components for test. Ideally this
 * would not be needed, and in truth it's just a wrapper to eliminate some boilerplate. It
 * exists because when you need to specify `entryComponents` for a test the setup becomes quite
 * a bit more complex than if you're just doing a basic component test.
 *
 * More about entryComponents complexity: https://github.com/angular/angular/issues/12079
 *
 * Use:
 * ```
 *   beforeEach(nsTestBedBeforeEach([MyComponent,MyFailComponent]));
 * ```
 *
 * **NOTE*** Remember to pair with {@see nsTestBedAfterEach}
 *
 * @param components Any components that you will create during the test
 * @param providers Any services your tests depend on
 * @param imports Any module imports your tests depend on
 * @param entryComponents Any entry components that your tests depend on
 */
function nsTestBedBeforeEach(components, providers, imports, entryComponents) {
    if (providers === void 0) { providers = []; }
    if (imports === void 0) { imports = []; }
    if (entryComponents === void 0) { entryComponents = []; }
    return function (done) {
        activeTestFixtures.push([]);
        // If there are no entry components we can take the simple path.
        if (entryComponents.length === 0) {
            testing_1.TestBed.configureTestingModule({
                declarations: components.slice(),
                providers: providers.slice(),
                imports: [nativescript_module_1.NativeScriptModule].concat(imports)
            });
        }
        else {
            // If there are entry components, we have to reset the testing platform.
            //
            // There's got to be a better way... (o_O)
            testing_1.TestBed.resetTestEnvironment();
            var EntryComponentsTestModule = /** @class */ (function () {
                function EntryComponentsTestModule() {
                }
                EntryComponentsTestModule = __decorate([
                    core_1.NgModule({
                        declarations: entryComponents,
                        exports: entryComponents,
                        entryComponents: entryComponents
                    })
                ], EntryComponentsTestModule);
                return EntryComponentsTestModule;
            }());
            testing_1.TestBed.initTestEnvironment(EntryComponentsTestModule, testing_2.platformBrowserDynamicTesting(platform_1.NS_COMPILER_PROVIDERS));
            testing_1.TestBed.configureTestingModule({
                declarations: components,
                imports: [
                    nativescript_module_1.NativeScriptModule, index_1.NativeScriptTestingModule, common_1.CommonModule
                ].concat(imports),
                providers: providers.concat(index_1.NATIVESCRIPT_TESTING_PROVIDERS),
            });
        }
        testing_1.TestBed.compileComponents()
            .then(function () { return done(); })
            .catch(function (e) {
            console.log("Failed to instantiate test component with error: " + e);
            console.log(e.stack);
            done();
        });
    };
}
exports.nsTestBedBeforeEach = nsTestBedBeforeEach;
/**
 * Helper for a basic component TestBed clean up.
 * @param resetEnv When true the testing environment will be reset
 * @param resetFn When resetting the environment, use this init function
 */
function nsTestBedAfterEach(resetEnv, resetFn) {
    if (resetEnv === void 0) { resetEnv = true; }
    if (resetFn === void 0) { resetFn = nsTestBedInit; }
    return function () {
        if (activeTestFixtures.length === 0) {
            throw new Error("There are no more declared fixtures." +
                "Did you call \"nsTestBedBeforeEach\" and \"nsTestBedAfterEach\" an equal number of times?");
        }
        var root = testingRootView();
        var fixtures = activeTestFixtures.pop();
        fixtures.forEach(function (fixture) {
            var fixtureView = fixture.nativeElement;
            if (fixtureView.parent === root) {
                root.removeChild(fixtureView);
            }
            fixture.destroy();
        });
        testing_1.TestBed.resetTestingModule();
        if (resetEnv) {
            testing_1.TestBed.resetTestEnvironment();
            resetFn();
        }
    };
}
exports.nsTestBedAfterEach = nsTestBedAfterEach;
/**
 * Render a component using the TestBed helper, and return a promise that resolves when the
 * ComponentFixture is fully initialized.
 */
function nsTestBedRender(componentType) {
    var fixture = testing_1.TestBed.createComponent(componentType);
    fixture.detectChanges();
    return fixture.whenRenderingDone()
        // TODO(jd): it seems that the whenStable and whenRenderingDone utilities of ComponentFixture
        //           do not work as expected. I looked at how to fix it and it's not clear how to provide
        //           a {N} specific subclass, because ComponentFixture is newed directly rather than injected
        // What to do about it? Maybe fakeAsync can help? For now just setTimeout for 100ms (x_X)
        .then(promiseWait(100))
        .then(function () {
        var list = activeTestFixtures[activeTestFixtures.length - 1];
        if (!list) {
            console.warn("nsTestBedRender called without nsTestBedBeforeEach/nsTestBedAfter each. " +
                "You are responsible for calling 'fixture.destroy()' when your test is done " +
                "in order to clean up the components that are created.");
        }
        else {
            list.push(fixture);
        }
        return fixture;
    });
}
exports.nsTestBedRender = nsTestBedRender;
//# sourceMappingURL=util.js.map