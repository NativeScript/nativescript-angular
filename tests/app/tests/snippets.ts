// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";

import { NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { bootstrapTestApp, destroyTestApp } from "./test-app";

import { GestureComponent } from "../snippets/gestures.component";
import { LayoutsComponent } from "../snippets/layouts.component";
import { IconFontComponent } from "../snippets/icon-font.component";

import { PageNavigationApp } from "../snippets/navigation/page-outlet";
import { NavigationApp } from "../snippets/navigation/router-outlet";
import { FirstComponent, SecondComponent } from "../snippets/navigation/navigation-common";
import { routes } from "../snippets/navigation/app.routes";
import {
    HeaderComponent,
    ItemComponent,
    DataService,
    ListTemplateSelectorTest,
} from "../snippets/list-view/template-selector.component";

import { device, platformNames } from "platform";
import {nTestBedAfterEach, nTestBedBeforeEach, nTestBedRender} from 'nativescript-angular/testing';
import {ComponentRef} from '@angular/core';
const IS_IOS = (device.os === platformNames.ios);

describe("Snippets", () => {

    beforeEach(nTestBedBeforeEach([GestureComponent, LayoutsComponent, IconFontComponent]));
    afterEach(nTestBedAfterEach(false));

    it("Gesture snippets can be loaded", () => {
        return nTestBedRender(GestureComponent).then((fixture) => {
            const componentRef: ComponentRef<GestureComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, GestureComponent);
        });
    });

    it("Layouts snippets can be loaded", () => {
        return nTestBedRender(LayoutsComponent).then((fixture) => {
            const componentRef: ComponentRef<LayoutsComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, LayoutsComponent);
        });
    });

    // TODO: Skip list-view test until karma test launcher double navigate bug is fixed
    (IS_IOS ? it.skip : it)("Icon-font snippets can be loaded", (done) => {
        return nTestBedRender(IconFontComponent).then((fixture) => {
            const componentRef: ComponentRef<IconFontComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, IconFontComponent);
            // Works around a "dehydrated change detector" exception.
            setTimeout(done, 10);
        });
    });
});

describe("Snippets Navigation", () => {
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
        bootstrapTestApp(NavigationApp, [], routes, [NavigationApp, FirstComponent, SecondComponent]).then((app) => {
            runningApp = app;

            return runningApp.done.then(() => {
                assert(app.startEvent instanceof NavigationStart);
                assert.equal("/", app.startEvent.url);

                assert(app.endEvent instanceof NavigationEnd);
                assert.equal("/", app.endEvent.url);
                assert.equal("/first", app.endEvent.urlAfterRedirects);

                cleanup();
            }).then(() => done(), err => done(err));
        });
    });

    it("page-router-outlet app", (done) => {
        bootstrapTestApp(PageNavigationApp, [], routes, [
            PageNavigationApp,
            FirstComponent,
            SecondComponent
        ]).then((app) => {

            console.log("PageNavigationApp instance: " + app);
            runningApp = app;

            return runningApp.done.then(() => {
                assert(app.startEvent instanceof NavigationStart);
                assert.equal("/", app.startEvent.url);

                assert(app.endEvent instanceof NavigationEnd);
                assert.equal("/", app.endEvent.url);
                assert.equal("/first", app.endEvent.urlAfterRedirects);

                cleanup();
            }).then(() => done(), err => done(err));
        });
    });
});

describe("Snippets ListView", () => {
    let runningApp: any;

    const cleanup = () => {
        if (runningApp) {
            destroyTestApp(runningApp);
            runningApp = null;
        }
    };

    after(cleanup);

    it("template selector", (done) => {
        bootstrapTestApp(
            ListTemplateSelectorTest,
            [DataService],
            null,
            [
                HeaderComponent,
                ItemComponent,
                ListTemplateSelectorTest
            ])
            .then((app) => {
                setTimeout(() => {
                    cleanup();
                    done();
                }, 100);
            })
            .catch(err => done(err));
    });
});
