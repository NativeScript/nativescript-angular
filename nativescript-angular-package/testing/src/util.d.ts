import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { ComponentFixture } from "@angular/core/testing";
import { Type } from "@angular/core";
/**
 * Get a reference to the fixtures container.
 */
export declare function testingRootView(): LayoutBase;
/**
 * Return a promise that resolves after (durationMs) milliseconds
 */
export declare function promiseWait(durationMs: number): () => Promise<{}>;
/**
 * Perform basic TestBed environment initialization. Call this once in the main entry point to your tests.
 */
export declare function nsTestBedInit(): void;
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
export declare function nsTestBedBeforeEach(components: any[], providers?: any[], imports?: any[], entryComponents?: any[]): (done: any) => void;
/**
 * Helper for a basic component TestBed clean up.
 * @param resetEnv When true the testing environment will be reset
 * @param resetFn When resetting the environment, use this init function
 */
export declare function nsTestBedAfterEach(resetEnv?: boolean, resetFn?: typeof nsTestBedInit): () => void;
/**
 * Render a component using the TestBed helper, and return a promise that resolves when the
 * ComponentFixture is fully initialized.
 */
export declare function nsTestBedRender<T>(componentType: Type<T>): Promise<ComponentFixture<T>>;
