// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";

import { GestureComponent } from "../snippets/gestures.component";
import { LayoutsComponent } from "../snippets/layouts.component";
import { IconFontComponent } from "../snippets/icon-font.component";

import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "@nativescript/angular/testing";
import { ComponentRef } from "@angular/core";

describe("Snippets", () => {

    beforeEach(nsTestBedBeforeEach([GestureComponent, LayoutsComponent, IconFontComponent]));
    afterEach(nsTestBedAfterEach(false));

    it("Gesture snippets can be loaded", () => {
        return nsTestBedRender(GestureComponent).then((fixture) => {
            const componentRef: ComponentRef<GestureComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, GestureComponent);
        });
    });

    it("Layouts snippets can be loaded", () => {
        return nsTestBedRender(LayoutsComponent).then((fixture) => {
            const componentRef: ComponentRef<LayoutsComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, LayoutsComponent);
        });
    });

    it("Icon-font snippets can be loaded", () => {
        return nsTestBedRender(IconFontComponent).then((fixture) => {
            const componentRef: ComponentRef<IconFontComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, IconFontComponent);
        });
    });
});
