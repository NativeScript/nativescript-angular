// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree } from "@angular/router";
import { NSLocationStrategy, LocationState } from "nativescript-angular/router/ns-location-strategy";
import { Frame, BackstackEntry, NavigationEntry } from "ui/frame";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { FrameService } from "nativescript-angular/platform-providers";

export class FakeFrameService extends FrameService {
    private frame: Frame;
    constructor(private backCB?: () => void) {
        super();
        this.frame = new FakeFrame(backCB);
    }

    public getFrame(): Frame {
        return this.frame;
    }
}

export class FakeFrame extends View implements Frame {
    backStack: Array<BackstackEntry>;
    currentPage: Page;
    currentEntry: NavigationEntry;
    animated: boolean;
    transition: any;
    _currentEntry: any;

    canGoBack(): boolean {
        return true;
    }
    goBack(to?: BackstackEntry) {
        if (this.backCB) {
            this.backCB();
        }
    }

    navigate(entry: any) {}

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
    public isCurrent(entry: BackstackEntry): boolean {
        throw new Error("I am a FakeFrame");
    }
    setCurrent(entry: BackstackEntry, isBack: boolean): void {
        throw new Error("I am a FakeFrame");
    }
    _findEntryForTag(fragmentTag: string): BackstackEntry {
        throw new Error("I am a FakeFrame");
    }

    _updateBackstack(entry: BackstackEntry, isBack: boolean): void {
        throw new Error("I am a FakeFrame");
    }
}

function initStrategy(initUrl: string, back?: () => void): NSLocationStrategy {
    const strategy = new NSLocationStrategy(new FakeFrameService(back));
    strategy.pushState(null, null, initUrl, null); // load initial state
    return strategy;
}

function assertStatesEqual(actual: Array<LocationState>, expected: Array<LocationState>) {
    assert.isArray(actual);
    assert.isArray(expected);
    assert.equal(actual.length, expected.length);

    for (let i = 0; i < actual.length; i++) {
        // UrlSegmentGroup is a cyclic structure. DeepEqual can't assert it.
        // Assert toString() since that is what we need and then remove from object.
        assert.equal(actual[i].segmentGroup.toString(), expected[i].segmentGroup.toString(),
            `
            State[${i}] segment group does not match!
            actual: ${actual[i].segmentGroup.toString()}
            expected: ${expected[i].segmentGroup.toString()}
            `
        );

        actual[i].segmentGroup = null;
        expected[i].segmentGroup = null;

        assert.deepEqual(
            actual[i],
            expected[i],
            `State[${i}] does not match!
        actual: ${JSON.stringify(actual[i])}
        expected: ${JSON.stringify(expected[i])}
            `
        );
    }
}

function createState(url: string,
    outletName: string,
    isPageNav: boolean = false,
    isModalNav: boolean = false,
    isRoot: boolean = false) {
    const urlSerializer = new DefaultUrlSerializer();
    const stateUrlTree: UrlTree = urlSerializer.parse(url);
    const rootOutlets = stateUrlTree.root.children;

    return {
        state: null,
        title: null,
        queryParams: null,
        segmentGroup: isRoot ? stateUrlTree.root : rootOutlets[outletName],
        isPageNavigation: isPageNav,
        isModalNavigation: isModalNav,
        isRootSegmentGroup: isRoot,
    };
}

function simulatePageNavigation(strategy: NSLocationStrategy, url: string, outletName: string) {
    strategy.pushState(null, null, url, null);
    strategy._beginPageNavigation(outletName);
}

function simulatePageBack(strategy: NSLocationStrategy, outletName: string) {
    strategy._beginBackPageNavigation(outletName);
    strategy.back();
    strategy._finishBackPageNavigation();
}

describe("NSLocationStrategy", () => {
    it("initial path() value", () => {
        const strategy = new NSLocationStrategy(new FakeFrameService());
        assert.equal(strategy.path(), "/");
    });

    it("pushState changes path", () => {
        const strategy = initStrategy("/");

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");
    });

    it("pushState changes path with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test12//test2:test2)");
    });

    it("canGoBack() return false initially", () => {
        const strategy = initStrategy("/");

        assert.isFalse(strategy.canGoBack(), "canGoBack() should return false if there are no navigations");
    });

    it("canGoBack() return false initially with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");

        assert.isFalse(strategy.canGoBack(), "canGoBack() should return false if there are no navigations");
    });

    it("canGoBack() return true after navigation", () => {
        const strategy = initStrategy("/");

        strategy.pushState(null, "test", "/test", null);

        assert.isTrue(strategy.canGoBack(), "canGoBack() should return true after navigation");
    });

    it("canGoBack() return true after navigation with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);

        assert.isTrue(strategy.canGoBack(), "canGoBack() should return true after navigation");
    });

    it("back() calls onPopState", () => {
        const strategy = initStrategy("/");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");
        assert.equal(popCount, 0);

        strategy.back();
        assert.equal(strategy.path(), "/");
        assert.equal(popCount, 1);
    });

    it("back() calls onPopState with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test12//test2:test2)");
        assert.equal(popCount, 0);

        strategy.back();
        assert.equal(strategy.path(), "/(test1:test1//test2:test2)");
        assert.equal(popCount, 1);
    });

    it("replaceState() replaces state - doesn't call onPopState", () => {
        const strategy = initStrategy("/");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");

        strategy.replaceState(null, "test2", "/test2", null);
        assert.equal(strategy.path(), "/test2");

        assert.equal(popCount, 0); // no onPopState when replacing
    });

    it("replaceState() replaces state - doesn't call onPopState with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test12//test2:test2)");

        strategy.replaceState(null, "test2", "/(test1:test13//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test13//test2:test2)");

        assert.equal(popCount, 0); // no onPopState when replacing
    });

    it("pushState() with page navigation", () => {
        const strategy = initStrategy("/");
        const expectedStates: Array<LocationState> = [createState("/", "primary", true, false, true)];

        simulatePageNavigation(strategy, "/page", "primary");
        expectedStates.push(createState("/page", "primary", true));

        strategy.pushState(null, null, "/internal", null);
        expectedStates.push(createState("/internal", "primary"));

        assertStatesEqual(strategy._getStates()["primary"], expectedStates);
    });

    it("pushState() with page navigation with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");
        const expectedStatesTest1: Array<LocationState> = [
            createState("/(test1:test1//test2:test2)", "test1", true)
        ];
        const expectedStatesTest2: Array<LocationState> = [
            createState("/(test1:test1//test2:test2)", "test2", true)
        ];

        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", "test1");
        expectedStatesTest1.push(createState("/(test1:page//test2:test2)", "test1", true));

        strategy.pushState(null, null, "/(test1:internal//test2:test2)", null);
        expectedStatesTest1.push(createState("/(test1:internal//test2:test2)", "test1"));

        assertStatesEqual(strategy._getStates()["test1"], expectedStatesTest1);
        assertStatesEqual(strategy._getStates()["test2"], expectedStatesTest2);
    });

    it("back() when on page-state calls frame.goBack() if no page navigation in progress", () => {
        let frameBackCount = 0;
        const strategy = initStrategy("/", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/page", "primary");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["primary"].length, 2);

        // Act
        strategy.back();

        // Assert
        assert.equal(frameBackCount, 1);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["primary"].length, 2);
    });

    it("back() when on page-state calls frame.goBack() if no page navigation in progress with named outlets", () => {
        let frameBackCount = 0;
        const strategy = initStrategy("/(test1:test1//test2:test2)", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", "test1");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["test1"].length, 2);
        assert.equal(strategy._getStates()["test2"].length, 1);

        // Act
        strategy.back();

        // Assert
        assert.equal(frameBackCount, 1);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["test1"].length, 2);
        assert.equal(strategy._getStates()["test2"].length, 1);
    });

    it("back() when on page-state navigates back if page navigation is in progress", () => {
        let frameBackCount = 0;
        const strategy = initStrategy("/", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/page", "primary");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["primary"].length, 2);

        // Act
        simulatePageBack(strategy, "primary");

        // Assert
        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 1);
        assert.equal(strategy._getStates()["primary"].length, 1);
    });

    it("back() when on page-state navigates back if page navigation is in progress with named outlets", () => {
        let frameBackCount = 0;
        const strategy = initStrategy("/(test1:test1//test2:test2)", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", "test1");

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(strategy._getStates()["test1"].length, 2);
        assert.equal(strategy._getStates()["test2"].length, 1);

        // Act
        simulatePageBack(strategy, "test1");

        // Assert
        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 1);
        assert.equal(strategy._getStates()["test1"].length, 1);
        assert.equal(strategy._getStates()["test2"].length, 1);
    });

    it("pushState() with clearHistory clears history", () => {
        const strategy = initStrategy("/");

        // Act
        strategy._setNavigationOptions({ clearHistory: true });
        simulatePageNavigation(strategy, "/cleared", "primary");

        // Assert
        assertStatesEqual(strategy._getStates()["primary"], [createState("/cleared", "primary", true)]);
    });

    it("pushState() with clearHistory clears history with named outlets", () => {
        const strategy = initStrategy("/(test1:test1//test2:test2)");

        // Act
        strategy._setNavigationOptions({ clearHistory: true });
        simulatePageNavigation(strategy, "/(test1:cleared//test2:test2)", "test1");
        const expectedStatesTest1: Array<LocationState> = [
            createState("/(test1:cleared//test2:test2)", "test1", true)
        ];
        const expectedStatesTest2: Array<LocationState> = [
            createState("/(test1:cleared//test2:test2)", "test2", true)
        ];

        // Assert
        assertStatesEqual(strategy._getStates()["test1"], expectedStatesTest1);
        assertStatesEqual(strategy._getStates()["test2"], expectedStatesTest2);
    });
});
