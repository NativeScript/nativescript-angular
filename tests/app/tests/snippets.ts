//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";

import {NavigationEnd, NavigationStart} from "@angular/router";
import {Subscription} from "rxjs";
import {TestApp, bootstrapTestApp, destroyTestApp} from "./test-app";

import {GestureComponent} from "../snippets/gestures.component";
import {LayoutsComponent} from "../snippets/layouts.component";
import {IconFontComponent} from "../snippets/icon-font.component";

import {PageNavigationApp} from "../snippets/navigation/page-outlet";
import {NavigationApp} from "../snippets/navigation/router-outlet";
import {routes} from "../snippets/navigation/app.routes";

import {device, platformNames} from "platform";
const IS_IOS = (device.os === platformNames.ios);

describe('Snippets', () => {
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
        });
    });

    after(() => {
        testApp.dispose();
    });

    it("Gesture snippets can be loaded", () => {
        return testApp.loadComponent(GestureComponent).then((componentRef) => {
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, GestureComponent);
        });
    });

    it("Layouts snippets can be loaded", () => {
        return testApp.loadComponent(LayoutsComponent).then((componentRef) => {
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, LayoutsComponent);
        });
    });

    // TODO: Skip list-view test until karma test launcher double navigate bug is fixed
    (IS_IOS ? it.skip : it)("Icon-font snippets can be loaded", (done) => {
        testApp.loadComponent(IconFontComponent).then((componentRef) => {
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, IconFontComponent);
            //Works around a "dehydrated change detector" exception.
            setTimeout(done, 10);
        });
    });
});

describe('Snippets Navigation', () => {
    let runningApp: any;
    let subscription: Subscription;

    const cleanup = () => {
        if (subscription) {
            subscription.unsubscribe();
            subscription = null;
        }
        if (runningApp) {
            destroyTestApp(runningApp);
            runningApp = null;
        }
    };

    after(cleanup);

    it("router-outlet app", (done) => {
        bootstrapTestApp(NavigationApp, [], routes).then((app) => {
            console.log("NavigationApp instance: " + app);
            runningApp = app;
            let navStarted = false;

            subscription = app.router.events.subscribe((e) => {
                console.log("------>>>>>> " + e.toString());
                //TODO: investigate why NavigationStart isn't raised
                //if (e instanceof NavigationStart) {
                    //assert.equal("/", e.url);
                    //navStarted = true;
                //}
                if (e instanceof NavigationEnd) {
                    //assert.isTrue(navStarted, "No NavigationStart event");
                    assert.equal("/", e.url);
                    assert.equal("/first", e.urlAfterRedirects);

                    cleanup();
                    done();
                }
            });
        });
    });

    it("page-router-outlet app", (done) => {
        bootstrapTestApp(PageNavigationApp, [], routes).then((app) => {
            runningApp = app;
            let navStarted = false;

            subscription = app.router.events.subscribe((e) => {
                //TODO: investigate why NavigationStart isn't raised
                //if (e instanceof NavigationStart) {
                    //assert.equal("/", e.url);
                    //navStarted = true;
                //}
                if (e instanceof NavigationEnd) {
                    //assert.isTrue(navStarted, "No NavigationStart event");
                    assert.equal("/", e.url);
                    assert.equal("/first", e.urlAfterRedirects);

                    cleanup();
                    done();
                }
            });
        });
    });
});
