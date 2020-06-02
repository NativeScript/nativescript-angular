// make sure you import mocha-config before @angular/core
import { Component, ViewChild } from "@angular/core";
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "@nativescript/angular/testing";
import { NativeScriptRouterModule, RouterExtensions } from "@nativescript/angular/router";
import { NSRouterLink } from "@nativescript/angular/router/ns-router-link";
import { NSLocationStrategy } from "@nativescript/angular";
import { assert } from "~/tests/test-config";
import { ActivatedRoute, Router, RouteReuseStrategy } from "@angular/router";
import { LocationStrategy, PlatformLocation } from "@angular/common";
import { NSRouteReuseStrategy } from "@nativescript/angular/router/ns-route-reuse-strategy";

@Component({
    template: `<StackLayout><Label nsRouterLink text="COMPONENT"></Label></StackLayout>`
})
class RouterTestComponent {
    @ViewChild(NSRouterLink, { static: false }) nsRouterLink: NSRouterLink;
}

describe("NativeScriptRouterModule.forRoot", () => {
    beforeEach(nsTestBedBeforeEach(
        [RouterTestComponent],
        [],
        [NativeScriptRouterModule.forRoot([])],
        []));

    afterEach(nsTestBedAfterEach());

    it("should provide nativescript routing services", () => {
        return nsTestBedRender(RouterTestComponent).then((fixture) => {
            const injector = fixture.componentRef.injector

            assert.instanceOf(injector.get(LocationStrategy, null), NSLocationStrategy);
            assert.instanceOf(injector.get(RouterExtensions, null), RouterExtensions);
            assert.instanceOf(injector.get(RouteReuseStrategy, null), NSRouteReuseStrategy);
        });
    });

    it("should provide nativescript routing directives", () => {
        return nsTestBedRender(RouterTestComponent).then((fixture) => {
            const linkDirective = fixture.componentRef.instance.nsRouterLink;
            assert.instanceOf(linkDirective, NSRouterLink);
        });
    });
});

describe("NativeScriptRouterModule.forChild", () => {
    beforeEach(nsTestBedBeforeEach(
        [RouterTestComponent],
        [
            { provide: Router, useValue: {} },
            { provide: RouterExtensions, useValue: {} },
            { provide: ActivatedRoute, useValue: {} },
        ],
        [NativeScriptRouterModule.forChild([])],
        []));
    afterEach(nsTestBedAfterEach());

    it("should not provide nativescript routing services", () => {
        return nsTestBedRender(RouterTestComponent).then((fixture) => {
            const injector = fixture.componentRef.injector
            assert.isNull(injector.get(LocationStrategy, null));
            assert.isNull(injector.get(RouteReuseStrategy, null));
        });
    });

    it("should provide nativescript routing directives", () => {
        return nsTestBedRender(RouterTestComponent).then((fixture) => {
            const linkDirective = fixture.componentRef.instance.nsRouterLink;
            assert.instanceOf(linkDirective, NSRouterLink);
        });
    });
});

