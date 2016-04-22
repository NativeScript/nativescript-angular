//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {Component, ElementRef, Renderer} from "angular2/core";
import {TestApp} from "./test-app";

import {GestureComponent} from "../snippets/gestures.component";
import {LayoutsComponent} from "../snippets/layouts.component";
import {IconFontComponent} from "../snippets/icon-font.component";

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
