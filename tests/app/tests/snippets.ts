// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";

import { NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";

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

import { device, platformNames, isIOS } from "platform";
import {nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender} from "nativescript-angular/testing";
import {ComponentRef} from "@angular/core";

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

    // TODO: Skip list-view test until karma test launcher double navigate bug is fixed
    (isIOS ? it.skip : it)("Icon-font snippets can be loaded", (done) => {
        return nsTestBedRender(IconFontComponent).then((fixture) => {
            const componentRef: ComponentRef<IconFontComponent> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, IconFontComponent);
            // Works around a "dehydrated change detector" exception.
            setTimeout(done, 10);
        });
    });
});
