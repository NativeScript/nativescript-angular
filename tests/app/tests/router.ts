//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {
    Type,
    Component,
    ComponentRef,
    DynamicComponentLoader,
    ViewChild,
    ElementRef,
    provide,
    ApplicationRef,
    ChangeDetectorRef
} from "@angular/core";

import {ProxyViewContainer} from "ui/proxy-view-container";
import {dumpView} from "./test-utils";
import {bootstrapTestApp, destroyTestApp} from "./test-app";

import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, ComponentInstruction, RouteConfig } from '@angular/router';
import {Location, LocationStrategy} from '@angular/common';
import {topmost, BackstackEntry} from "ui/frame";
import {Page} from "ui/page";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router/ns-router";

@Component({
    template: `<StackLayout><Label text="Layout"></Label></StackLayout>`
})
export class LayoutWithLabel {
    constructor(public elementRef: ElementRef) { }
}


const hooksLog = [];
class CompBase implements OnActivate, OnDeactivate {
    protected name: string = "";

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("activate", nextInstruction, prevInstruction);
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("deactivate", nextInstruction, prevInstruction);
    }

    private log(method: string, nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction) {
        hooksLog.push(this.name + "." + method + " " + nextInstruction.urlPath + " " + (prevInstruction ? prevInstruction.urlPath : null));
    }
}

@Component({
    selector: "first-comp",
    template: `<Label text="First"></Label>`
})
export class FirstComponent extends CompBase {
    protected name = "first";
}

@Component({
    selector: "second-comp",
    template: `<Label text="Second"></Label>`
})
export class SecondComponent extends CompBase {
    protected name = "second";
}

@Component({
    selector: "outlet-app",
    directives: [ROUTER_DIRECTIVES],
    template: `<router-outlet></router-outlet>`

})
@RouteConfig([
    { path: '/first', name: 'First', component: FirstComponent, useAsDefault: true },
    { path: '/second', name: 'Second', component: SecondComponent }
])
export class SimpleOutletCompnenet {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}

@Component({
    selector: "page-outlet-app",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`

})
@RouteConfig([
    { path: '/first', name: 'First', component: FirstComponent, useAsDefault: true },
    { path: '/second', name: 'Second', component: SecondComponent }
])
export class PageOutletCompnenet {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}

describe('router-outlet', () => {
    let testApp: SimpleOutletCompnenet = null;

    beforeEach((done) => {
        hooksLog.length = 0;
        return bootstrapTestApp(SimpleOutletCompnenet, [NS_ROUTER_PROVIDERS]).then((app: SimpleOutletCompnenet) => {
            testApp = app;
            setTimeout(done, 0);
        });
    });

    afterEach(() => {
        destroyTestApp(testApp)
    });


    it("loads default path", () => {
        assert.equal("(ROOT (ProxyViewContainer), (ProxyViewContainer (Label[text=First])))", dumpView(testApp.elementRef.nativeElement, true));
    });

    it("navigates to other component", () => {
        return testApp.router.navigateByUrl("/second").then(() => {
            assert.equal("(ROOT (ProxyViewContainer), (ProxyViewContainer (Label[text=Second])))", dumpView(testApp.elementRef.nativeElement, true));
        })
    });

    it("navigates to other component and then comes back", () => {
        return testApp.router.navigateByUrl("/second").then(() => {
            return testApp.router.navigateByUrl("/first");
        }).then(() => {
            assert.equal("(ROOT (ProxyViewContainer), (ProxyViewContainer (Label[text=First])))", dumpView(testApp.elementRef.nativeElement, true));
        })
    });

    it("hooks are fired when navigating", () => {
        return testApp.router.navigateByUrl("/second").then(() => {
            return testApp.router.navigateByUrl("/first");
        }).then(() => {
            var expected = [
                "first.activate first null",
                "first.deactivate second first",
                "second.activate second first",
                "second.deactivate first second",
                "first.activate first second"];

            assert.equal(hooksLog.join("|"), expected.join("|"));
        })
    });
});

describe.skip('page-router-outlet', () => {
    let testApp: PageOutletCompnenet = null;
    var initialBackstackLength: number;
    var initalPage: Page;

    before((done) => {
        // HACK: Wait for the navigations from the test runner app
        // Remove the setTimeout when test runner start tests on page.navigatedTo
        setTimeout(() => {
            initialBackstackLength = topmost().backStack.length;
            initalPage = topmost().currentPage;
            done();
        }, 1000); 
    })

    beforeEach((done) => {
        hooksLog.length = 0;

        bootstrapTestApp(PageOutletCompnenet, [NS_ROUTER_PROVIDERS]).then((app: PageOutletCompnenet) => {
            testApp = app;
            setTimeout(done, 0);
        });
    });

    afterEach(() => {
        destroyTestApp(testApp)

        // Ensure navigation to inital page
        const backStack = topmost().backStack;
        if (backStack.length > initialBackstackLength) {
            return goBackToEntry(backStack[initialBackstackLength]);
        }
        else {
            return true;
        }
    });

    function goBackToEntry(entry: BackstackEntry): Promise<any> {
        var navPromise = getNavigatedPromise(entry.resolvedPage);
        topmost().goBack(entry);
        return navPromise;
    }

    function getNavigatedPromise(page: Page): Promise<any> {
        return new Promise((resolve, reject) => {
            var callback = () => {
                page.off("navigatedTo", callback);
                setTimeout(resolve, 0);
            }
            page.on("navigatedTo", callback)
        })
    }

    it("loads default path", () => {
        //             App-Root   app-component       first-component        
        //                |           |                     | 
        var expected = "(ROOT (ProxyViewContainer), (ProxyViewContainer (Label[text=First])))";
        assert.equal(expected, dumpView(testApp.elementRef.nativeElement, true));
    });

    it("navigates to other component", () => {
        return testApp.router.navigateByUrl("/second")
            .then(() => {
                assert.equal("(ProxyViewContainer (Label[text=Second]))", dumpView(topmost().currentPage.content, true));
            })
    });

    it("navigates to other component and then comes back", () => {
        return testApp.router.navigateByUrl("/second")
            .then(() => {
                var navPromise = getNavigatedPromise(initalPage);
                testApp.location.back();
                return navPromise;
            }).then(() => {
                assert.equal(topmost().currentPage, initalPage);
                assert.equal("(ROOT (ProxyViewContainer), (ProxyViewContainer (Label[text=First])))", dumpView(testApp.elementRef.nativeElement, true));
            })
    });


    it("hooks are fired when navigating", () => {
        return testApp.router.navigateByUrl("/second")
            .then(() => {
                var navPromise = getNavigatedPromise(initalPage);
                testApp.location.back();
                return navPromise;
            }).then(() => {
                var expected = [
                    "first.activate first null",
                    "first.deactivate second first",
                    "second.activate second first",
                    "second.deactivate first second",
                    "first.activate first second"];

                assert.equal(hooksLog.join("|"), expected.join("|"));
            })
    });
});
