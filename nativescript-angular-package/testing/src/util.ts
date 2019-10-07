
import { View } from "tns-core-modules/ui/core/view";
import { topmost } from "tns-core-modules/ui/frame";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgModule, Type } from "@angular/core";
import { NativeScriptModule } from "../../nativescript.module";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { NS_COMPILER_PROVIDERS } from "../../platform";
import { NATIVESCRIPT_TESTING_PROVIDERS, NativeScriptTestingModule } from "../index";
import { CommonModule } from "@angular/common";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";

const TESTING_ROOT_ID = "__testing_container";

/**
 * Get a reference to the fixtures container.
 */
export function testingRootView(): LayoutBase {
    const rootPageLayout = topmost().currentPage.content as LayoutBase;

    let testingRoot: LayoutBase;
    rootPageLayout.eachChild(child => {
        if (child.id === TESTING_ROOT_ID) {
            testingRoot = child as LayoutBase;
            return false;
        }
        return true;
    });

    if (!testingRoot) {
        testingRoot = new GridLayout();
        testingRoot.id = TESTING_ROOT_ID;
        GridLayout.setColumnSpan(testingRoot, 100);
        GridLayout.setRowSpan(testingRoot, 100);
        rootPageLayout.addChild(testingRoot);
    }

    return testingRoot;
}


/**
 * Declared test contexts. When the suite is done this map should be empty if all lifecycle
 * calls have happened as expected.
 * @private
 */
const activeTestFixtures: ComponentFixture<any>[][] = [];

/**
 * Return a promise that resolves after (durationMs) milliseconds
 */
export function promiseWait(durationMs: number) {
    return () => new Promise((resolve) => setTimeout(() => resolve(), durationMs));
}

/**
 * Perform basic TestBed environment initialization. Call this once in the main entry point to your tests.
 */
export function nsTestBedInit() {
    TestBed.initTestEnvironment(
        NativeScriptTestingModule,
        platformBrowserDynamicTesting(NS_COMPILER_PROVIDERS)
    );
}

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
export function nsTestBedBeforeEach(
    components: any[],
    providers: any[] = [],
    imports: any[] = [],
    entryComponents: any[] = []) {
    return (done) => {
        activeTestFixtures.push([]);
        // If there are no entry components we can take the simple path.
        if (entryComponents.length === 0) {
            TestBed.configureTestingModule({
                declarations: [...components],
                providers: [...providers],
                imports: [NativeScriptModule, ...imports]
            });
        } else {
            // If there are entry components, we have to reset the testing platform.
            //
            // There's got to be a better way... (o_O)
            TestBed.resetTestEnvironment();
            @NgModule({
                declarations: entryComponents,
                exports: entryComponents,
                entryComponents: entryComponents
            })
            class EntryComponentsTestModule {
            }
            TestBed.initTestEnvironment(
                EntryComponentsTestModule,
                platformBrowserDynamicTesting(NS_COMPILER_PROVIDERS)
            );
            TestBed.configureTestingModule({
                declarations: components,
                imports: [
                    NativeScriptModule, NativeScriptTestingModule, CommonModule,
                    ...imports
                ],
                providers: [...providers, ...NATIVESCRIPT_TESTING_PROVIDERS],
            });
        }
        TestBed.compileComponents()
            .then(() => done())
            .catch((e) => {
                console.log(`Failed to instantiate test component with error: ${e}`);
                console.log(e.stack);
                done();
            });
    };
}

/**
 * Helper for a basic component TestBed clean up.
 * @param resetEnv When true the testing environment will be reset
 * @param resetFn When resetting the environment, use this init function
 */
export function nsTestBedAfterEach(resetEnv = true, resetFn = nsTestBedInit) {
    return () => {
        if (activeTestFixtures.length === 0) {
            throw new Error(
                `There are no more declared fixtures.` +
                `Did you call "nsTestBedBeforeEach" and "nsTestBedAfterEach" an equal number of times?`
            );
        }
        const root = testingRootView() as LayoutBase;
        const fixtures = activeTestFixtures.pop();
        fixtures.forEach((fixture) => {
            const fixtureView = <View>fixture.nativeElement;
            if (fixtureView.parent === root) {
                root.removeChild(fixtureView);
            }
            fixture.destroy();
        });
        TestBed.resetTestingModule();
        if (resetEnv) {
            TestBed.resetTestEnvironment();
            resetFn();
        }
    };
}

/**
 * Render a component using the TestBed helper, and return a promise that resolves when the
 * ComponentFixture is fully initialized.
 */
export function nsTestBedRender<T>(componentType: Type<T>): Promise<ComponentFixture<T>> {
    const fixture = TestBed.createComponent(componentType);
    fixture.detectChanges();
    return fixture.whenRenderingDone()
        // TODO(jd): it seems that the whenStable and whenRenderingDone utilities of ComponentFixture
        //           do not work as expected. I looked at how to fix it and it's not clear how to provide
        //           a {N} specific subclass, because ComponentFixture is newed directly rather than injected
        // What to do about it? Maybe fakeAsync can help? For now just setTimeout for 100ms (x_X)
        .then(promiseWait(100))
        .then(() => {
            const list = activeTestFixtures[activeTestFixtures.length - 1];
            if (!list) {
                console.warn(
                    "nsTestBedRender called without nsTestBedBeforeEach/nsTestBedAfter each. " +
                    "You are responsible for calling 'fixture.destroy()' when your test is done " +
                    "in order to clean up the components that are created."
                );
            } else {
                list.push(fixture);
            }
            return fixture;
        });
}
