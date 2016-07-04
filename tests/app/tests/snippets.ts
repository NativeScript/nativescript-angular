//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";

import {Component, ElementRef, Renderer} from "@angular/core";
import {NavigationEnd, NavigationStart, NavigationError} from "@angular/router";

import {Subscription} from "rxjs";
import {TestApp, bootstrapTestApp, destroyTestApp} from "./test-app";

import {GestureComponent} from "../snippets/gestures.component";
import {LayoutsComponent} from "../snippets/layouts.component";
import {IconFontComponent} from "../snippets/icon-font.component";

import {APP_ROUTER_PROVIDERS} from "../snippets/navigation/app.routes";
import {PageNavigationApp} from "../snippets/navigation/page-outlet";
import {NavigationApp} from "../snippets/navigation/router-outlet";

import {device, platformNames} from "platform";
const IS_IOS = (device.os === platformNames.ios);

describe('Snippets', () => {
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
        })
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
})

describe('Snippets Navigation', () => {
    var runningApp: any;
    var subscription: Subscription;

    var cleanup = () => {
        if (subscription) {
            subscription.unsubscribe();
            subscription = null;
        }
        if (runningApp) {
            destroyTestApp(runningApp);
            runningApp = null;
        }
    }

    after(cleanup);

    it("router-outlet app", (done) => {
        bootstrapTestApp(NavigationApp, [APP_ROUTER_PROVIDERS]).then((app) => {
            console.log("app bootstraped");
            runningApp = app;
            var navStarted = false;

            subscription = app.router.events.subscribe((e) => {
                if (e instanceof NavigationStart) {
                    assert.equal("/", e.url);
                    navStarted = true;
                }
                if (e instanceof NavigationEnd) {
                    assert.isTrue(navStarted, "No NavigationStart event");
                    assert.equal("/", e.url);
                    assert.equal("/first", e.urlAfterRedirects);

                    cleanup();
                    done();
                }
            })
        })
    });

    it("page-router-outlet app", (done) => {
        console.log("------------- PageNavigationApp: " + PageNavigationApp);

        bootstrapTestApp(PageNavigationApp, [APP_ROUTER_PROVIDERS]).then((app) => {
            console.log("app bootstraped");
            runningApp = app;
            var navStarted = false;

            subscription = app.router.events.subscribe((e) => {
                if (e instanceof NavigationStart) {
                    assert.equal("/", e.url);
                    navStarted = true;
                }
                if (e instanceof NavigationEnd) {
                    assert.isTrue(navStarted, "No NavigationStart event");
                    assert.equal("/", e.url);
                    assert.equal("/first", e.urlAfterRedirects);

                    cleanup();
                    done();
                }
            })
        })
    });
});