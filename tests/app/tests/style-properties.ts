// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { TextField } from "@nativescript/core/ui/text-field";
import { Red, Lime } from "@nativescript/core/color/known-colors";
import { NativeScriptRendererFactory, NativeScriptRenderer } from "@nativescript/angular/renderer";
import { device } from "@nativescript/core/platform";
import { ViewEncapsulation, RendererType2, Renderer2 } from "@angular/core";
import { NgView } from "@nativescript/angular/view-util";
import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";

describe("Setting style properties", () => {
    let renderer: NativeScriptRenderer = null;
    let element: NgView = null;

    beforeEach(() => {
        const rootView = new StackLayout();
        const rendererFactory = new NativeScriptRendererFactory(rootView, device, null);
        renderer = rendererFactory.createRenderer(null, {
            id: "id",
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });

        element = <NgView><any>new TextField();
    });

    it("resolves hyphenated CSS names", () => {
        renderer.setStyle(element, "background-color", "red");
        assert.equal(Red, element.style.backgroundColor.hex);
    });

    it("resolves camel-cased JavaScript names", () => {
        renderer.setStyle(element, "backgroundColor", "lime");
        assert.equal(Lime, element.style.backgroundColor.hex);
    });

    it("resolves CSS shorthand properties", () => {
        renderer.setStyle(element, "font", "12");
        assert.equal(12, element.style.fontSize);
    });
});
