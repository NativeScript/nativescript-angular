//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {Component, ElementRef, Renderer} from "angular2/core";
import {TestApp} from "./test-app";

import {GestureComponent} from "../snippets/gestures.component";
import {LayoutsComponent} from "../snippets/layouts.component";

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
})