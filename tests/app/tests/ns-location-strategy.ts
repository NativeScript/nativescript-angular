// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { DefaultUrlSerializer, UrlTree } from "@angular/router";
import { NSLocationStrategy, LocationState, Outlet } from "nativescript-angular/router/ns-location-strategy";
import { Frame, BackstackEntry, NavigationEntry } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
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

    navigate(entry: any) { }

    constructor(private backCB?: () => void) {
        super();
    }

    public navigationQueueIsEmpty(): boolean {
        throw new Error("navigationQueueIsEmpty:I am a FakeFrame");
    }

    public get navigationBarHeight(): number {
        throw new Error("navigationBarHeight:I am a FakeFrame");
    }

    public _processNavigationQueue(page: Page) {
        throw new Error("_processNavigationQueue:I am a FakeFrame");
    }

    public _updateActionBar(page?: Page) {
        throw new Error("_updateActionBar:I am a FakeFrame");
    }

    public _getNavBarVisible(page: Page): boolean {
        throw new Error("_getNavBarVisible:I am a FakeFrame");
    }
    public isCurrent(entry: BackstackEntry): boolean {
        throw new Error("isCurrent:I am a FakeFrame");
    }
    setCurrent(entry: BackstackEntry, isBack: boolean): void {
        throw new Error("setCurrent:I am a FakeFrame");
    }
    _findEntryForTag(fragmentTag: string): BackstackEntry {
        throw new Error("_findEntryForTag:I am a FakeFrame");
    }
    _updateBackstack(entry: BackstackEntry, isBack: boolean): void {
        throw new Error("_updateBackstack:I am a FakeFrame");
    }
    _pushInFrameStack() {
        throw new Error("_pushInFrameStack:I am a FakeFrame");
    }
    _removeFromFrameStack() {
        throw new Error("_removeFromFrameStack:I am a FakeFrame");
    }
}

// tslint:disable-next-line:max-line-length
function initStrategy(initUrl: string, back?: () => void): { strategy: NSLocationStrategy, frameService: FrameService } {
    const frameService = new FakeFrameService(back);
    const strategy = new NSLocationStrategy(frameService);
    strategy.pushState(null, null, initUrl, null); // load initial state
    return { strategy: strategy, frameService: frameService };
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

function createState(
    url: string,
    outletName: string,
    isPageNav: boolean = false,
    isRoot: boolean = false) {
    const urlSerializer = new DefaultUrlSerializer();
    const stateUrlTree: UrlTree = urlSerializer.parse(url);
    const rootOutlets = stateUrlTree.root.children;

    return {
        segmentGroup: isRoot ? stateUrlTree.root : rootOutlets[outletName],
        isPageNavigation: isPageNav,
        isRootSegmentGroup: isRoot,
    };
}

function simulatePageNavigation(strategy: NSLocationStrategy, url: string, frame: any, outletName?: string) {
    outletName = outletName || "primary";
    strategy.pushState(null, null, url, null);

    const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
    outlet.frame = frame;
    strategy._beginPageNavigation(frame);
}

function simulatePageBack(strategy: NSLocationStrategy, frame: any) {
    strategy._beginBackPageNavigation(frame);
    strategy.back();
    strategy._finishBackPageNavigation(frame);
}

describe("NSLocationStrategy", () => {
    it("initial path() value", () => {
        const strategy = new NSLocationStrategy(new FakeFrameService());
        assert.equal(strategy.path(), "/");
    });

    it("pushState changes path", () => {
        const { strategy } = initStrategy("/");

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");
    });

    it("pushState changes path with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test12//test2:test2)");
    });

    it("canGoBack() return false initially", () => {
        const { strategy } = initStrategy("/");

        assert.isFalse(strategy.canGoBack(), "canGoBack() should return false if there are no navigations");
    });

    it("canGoBack() return false initially with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");

        assert.isFalse(strategy.canGoBack(), "canGoBack() should return false if there are no navigations");
    });

    it("canGoBack() return true after navigation", () => {
        const { strategy } = initStrategy("/");

        strategy.pushState(null, "test", "/test", null);

        assert.isTrue(strategy.canGoBack(), "canGoBack() should return true after navigation");
    });

    it("canGoBack() return true after navigation with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);

        assert.isTrue(strategy.canGoBack(), "canGoBack() should return true after navigation");
    });

    it("back() calls onPopState", () => {
        const { strategy } = initStrategy("/");
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
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");
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
        const { strategy } = initStrategy("/");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/test", null);
        assert.equal(strategy.path(), "/test");

        strategy.replaceState(null, "test2", "/test2", null);
        // Currently replaceState does nothing since this shouldn't affect any functionality on {N} side.
        // replaceState should be relevant only in Web.
        // assert.equal(strategy.path(), "/test2");

        assert.equal(popCount, 0); // no onPopState when replacing
    });

    it("replaceState() replaces state - doesn't call onPopState with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        strategy.pushState(null, "test", "/(test1:test12//test2:test2)", null);
        assert.equal(strategy.path(), "/(test1:test12//test2:test2)");

        strategy.replaceState(null, "test2", "/(test1:test13//test2:test2)", null);
        // Currently replaceState does nothing since this shouldn't affect any functionality on {N} side.
        // replaceState should be relevant only in Web.
        // assert.equal(strategy.path(), "/(test1:test13//test2:test2)");

        assert.equal(popCount, 0); // no onPopState when replacing
    });

    it("pushState() with page navigation", () => {
        const { strategy } = initStrategy("/");
        const outletName = "primary";
        const expectedStates: Array<LocationState> = [createState("/", outletName, true, true)];
        const frame = new FakeFrame();

        simulatePageNavigation(strategy, "/page", frame, outletName);
        expectedStates.push(createState("/page", outletName, true));

        strategy.pushState(null, null, "/internal", null);
        expectedStates.push(createState("/internal", outletName));

        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);

        assertStatesEqual(outlet.states, expectedStates);
    });

    it("pushState() with page navigation with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");
        const frame = new FakeFrame();
        const frame2 = new FakeFrame();
        const outletName = "test1";
        const outletName2 = "test2";
        const expectedStatesTest1: Array<LocationState> = [
            createState("/(test1:test1//test2:test2)", outletName, true)
        ];
        const expectedStatesTest2: Array<LocationState> = [
            createState("/(test1:test1//test2:test2)", outletName2, true)
        ];

        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", frame, outletName);
        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", frame2, outletName2);
        expectedStatesTest1.push(createState("/(test1:page//test2:test2)", outletName, true));

        strategy.pushState(null, null, "/(test1:internal//test2:test2)", null);
        expectedStatesTest1.push(createState("/(test1:internal//test2:test2)", outletName));

        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
        const outlet2: Outlet = strategy.findOutletByOutletPath(outletName2);

        assertStatesEqual(outlet.states, expectedStatesTest1);
        assertStatesEqual(outlet2.states, expectedStatesTest2);
    });

    it("back() when on page-state calls frame.goBack() if no page navigation in progress", () => {
        let frameBackCount = 0;
        const outletName = "primary";

        const { strategy, frameService } = initStrategy("/", () => {
            frameBackCount++;
        });

        const currentFrame = frameService.getFrame();

        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/page", currentFrame, outletName);
        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);

        // Act
        strategy.back();

        // Assert
        assert.equal(frameBackCount, 1);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);
    });

    it("back() when on page-state calls frame.goBack() if no page navigation in progress with named outlets", () => {
        let frameBackCount = 0;
        const frame = new FakeFrame();
        const outletName = "test1";
        const outletName2 = "test2";
        const { strategy, frameService } = initStrategy("/(test1:test1//test2:test2)", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        const currentFrame = frameService.getFrame();
        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", frame, outletName);
        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", currentFrame, outletName2);
        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
        const outlet2: Outlet = strategy.findOutletByOutletPath(outletName2);

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);
        assert.equal(outlet2.states.length, 1);

        // Act
        strategy.back();

        // Assert
        assert.equal(frameBackCount, 1);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);
        assert.equal(outlet2.states.length, 1);
    });

    it("back() when on page-state navigates back if page navigation is in progress", () => {
        let frameBackCount = 0;
        const outletName = "primary";
        const { strategy, frameService } = initStrategy("/", () => {
            frameBackCount++;
        });

        const currentFrame = frameService.getFrame();
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/page", currentFrame, outletName);
        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);

        // Act
        simulatePageBack(strategy, currentFrame);

        // Assert
        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 1);
        assert.equal(outlet.states.length, 1);
    });

    it("back() when on page-state navigates back if page navigation is in progress with named outlets", () => {
        let frameBackCount = 0;
        const frame = new FakeFrame();
        const frame2 = new FakeFrame();
        const outletName = "test1";
        const outletName2 = "test2";

        const { strategy, frameService } = initStrategy("/(test1:test1//test2:test2)", () => {
            frameBackCount++;
        });
        let popCount = 0;
        strategy.onPopState(() => {
            popCount++;
        });

        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", frame, outletName);
        simulatePageNavigation(strategy, "/(test1:page//test2:test2)", frame2, outletName2);
        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
        const outlet2: Outlet = strategy.findOutletByOutletPath(outletName2);

        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 0);
        assert.equal(outlet.states.length, 2);
        assert.equal(outlet2.states.length, 1);

        // Act
        simulatePageBack(strategy, frame);

        // Assert
        assert.equal(frameBackCount, 0);
        assert.equal(popCount, 1);
        assert.equal(outlet.states.length, 1);
        assert.equal(outlet2.states.length, 1);
    });

    it("pushState() with clearHistory clears history", () => {
        const { strategy } = initStrategy("/");
        const frame = new FakeFrame();
        const outletName = "primary";
        // Act
        strategy._setNavigationOptions({ clearHistory: true });
        simulatePageNavigation(strategy, "/cleared", frame, outletName);
        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
        // Assert
        assertStatesEqual(outlet.states, [createState("/cleared", outletName, true)]);
    });

    it("pushState() with clearHistory clears history with named outlets", () => {
        const { strategy } = initStrategy("/(test1:test1//test2:test2)");
        const frame = new FakeFrame();
        const outletName = "test1";
        const frame2 = new FakeFrame();
        const outletName2 = "test2";

        // Act
        strategy._setNavigationOptions({ clearHistory: true });
        simulatePageNavigation(strategy, "/(test1:cleared//test2:test2)", frame, outletName);
        simulatePageNavigation(strategy, "/(test1:cleared//test2:test2)", frame2, outletName2);
        const expectedStatesTest1: Array<LocationState> = [
            createState("/(test1:cleared//test2:test2)", outletName, true)
        ];
        const expectedStatesTest2: Array<LocationState> = [
            createState("/(test1:cleared//test2:test2)", outletName2, true)
        ];

        const outlet: Outlet = strategy.findOutletByOutletPath(outletName);
        const outlet2: Outlet = strategy.findOutletByOutletPath(outletName2);

        // Assert
        assertStatesEqual(outlet.states, expectedStatesTest1);
        assertStatesEqual(outlet2.states, expectedStatesTest2);
    });
});
