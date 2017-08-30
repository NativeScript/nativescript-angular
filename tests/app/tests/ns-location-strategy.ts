// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { NSLocationStrategy, LocationState } from "nativescript-angular/router/ns-location-strategy";
import { Frame, BackstackEntry, NavigationEntry } from "ui/frame";
import { Page } from "ui/page";
import { View } from "ui/core/view";

class FakeFrame extends View implements Frame {
    backStack: Array<BackstackEntry>;
    currentPage: Page;
    currentEntry: NavigationEntry;
    animated: boolean;
    transition: any;

    canGoBack(): boolean { return true; }
    goBack(to?: BackstackEntry) {
        if (this.backCB) {
            this.backCB();
        }
    }

    navigate(entry: any) { }

    constructor(private backCB?: () => void) {
        super();
    }

    public navigationQueueIsEmpty(): boolean {
        throw new Error("I am a FakeFrame");
    }

    public get navigationBarHeight(): number {
        throw new Error("I am a FakeFrame");
    }

    public _processNavigationQueue(page: Page) {
        throw new Error("I am a FakeFrame");
    }

    public _updateActionBar(page?: Page) {
        throw new Error("I am a FakeFrame");
    }

    public _getNavBarVisible(page: Page): boolean {
        throw new Error("I am a FakeFrame");
    }
}

function initStrategy(back?: () => void): NSLocationStrategy {
    const strategy = new NSLocationStrategy(new FakeFrame(back));
    strategy.pushState(null, null, "/", null); // load initial state
    return strategy;
}

function assertStatesEqual(actual: Array<LocationState>, expected: Array<LocationState>) {
    assert.isArray(actual);
    assert.isArray(expected);
    assert.equal(actual.length, expected.length);

    for (let i = 0; i < actual.length; i++) {
        assert.deepEqual(
            actual[i], expected[i],
            `State[${i}] does not match!
    actual: ${JSON.stringify(actual[i])}
    expected: ${JSON.stringify(expected[i])}
            `);
    }
}

function createState(url: string, isPageNav: boolean = false) {
    return {
        state: null,
        title: null,
        url: url,
        queryParams: null,
        isPageNavigation: isPageNav
    };
}

function simulatePageNavigation(strategy: NSLocationStrategy, url: string) {
    strategy.pushState(null, null, url, null);
    strategy._beginPageNavigation();
}

function simulatePageBack(strategy: NSLocationStrategy) {
    strategy._beginBackPageNavigation();
    strategy.back();
    strategy._finishBackPageNavigation();
}

describe("NSLocationStrategy", () => {

    it("initial path() value", () => {
        const strategy = new NSLocationStrategy(new FakeFrame());
        assert.equal(strategy.path(), "/");
    });


    it("pushState changes path", () => {
        const strategy = initStrategy();

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");
    });

    it("canGoBack() return false initially", () => {
        const strategy = initStrategy();

        assert.isFalse(strategy.canGoBack(), "canGoBack() should return false if there are no navigations");
    });

    it("canGoBack() return true after navigation", () => {
        const strategy = initStrategy();

        strategy.pushState(null, "test", "/test", null);

        assert.isTrue(strategy.canGoBack(), "canGoBack() should return true after navigation");
    });

    it("back() calls onPopState", () => {
        const strategy = initStrategy();
        let popCount = 0;
        strategy.onPopState(() => { popCount++; });

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");
        assert.equal(popCount, 0);

        strategy.back();
        assert.equal(strategy.path(), "/");
        assert.equal(popCount, 1);
    });

    it("replaceState() replaces state - doesn't call onPopState", () => {
        const strategy = initStrategy();
        let popCount = 0;
        strategy.onPopState(() => { popCount++; });

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");

        strategy.replaceState(null, "test2", "/test2", null);
        assert.equal(strategy.path(), "/test2");

        assert.equal(popCount, 0); // no onPopState when replacing
    });

    it("pushState() with page navigation", () => {
        const strategy = initStrategy();
        const expectedStates: Array<LocationState> = [createState("/", true)];

        simulatePageNavigation(strategy, "/page");
        expectedStates.push(createState("/page", true));

        strategy.pushState(null, null, "/internal", null);
        expectedStates.push(createState("/internal"));

        assertStatesEqual(strategy._getStates(), expectedStates);
    });


    it("back() when on page-state calls frame.goBack() if no page navigation in progress", () => {
        let frameBackCount = 0;
        const strategy = initStrategy(() => { frameBackCount++; });
        let popCount = 0;
        strategy.onPopState(() => { popCount++; });

        simulatePageNavigation(strategy, "/page");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates().length, 2);

        // Act
        strategy.back();

        // Assert
        assert.equal(frameBackCount, 1);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates().length, 2);
    });


    it("back() when on page-state navigates back if page navigation is in progress", () => {
        let frameBackCount = 0;
        const strategy = initStrategy(() => { frameBackCount++; });
        let popCount = 0;
        strategy.onPopState(() => { popCount++; });

        simulatePageNavigation(strategy, "/page");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates().length, 2);

        // Act
        simulatePageBack(strategy);

        // Assert
        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 1);
        assert.equal(strategy._getStates().length, 1);
    });


    it("pushState() with clearHistory clears history", () => {
        const strategy = initStrategy();

        // Act
        strategy._setNavigationOptions({ clearHistory: true });
        simulatePageNavigation(strategy, "/cleared");

        // Assert
        assertStatesEqual(strategy._getStates(), [createState("/cleared", true)]);
    });
});
