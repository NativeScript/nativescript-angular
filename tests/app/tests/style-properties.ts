//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {TextField} from "ui/text-field";
import {Red, Lime} from "color/known-colors";
import {NativeScriptRenderer, NativeScriptRootRenderer, NativeScriptAnimationDriver, NgView} from "nativescript-angular";
import {device} from "platform";
import { ViewEncapsulation, RenderComponentType } from "@angular/core";

describe("Setting style properties", () => {
    let renderer: NativeScriptRenderer = null;
    let element: NgView = null;

    beforeEach(() => {
        const rootRenderer = new NativeScriptRootRenderer(null, device, null);
        const componentType = new RenderComponentType(
            "id",
            "templateUrl",
            0,
            ViewEncapsulation.None,
            [],
            {}
        );
        renderer = new NativeScriptRenderer(rootRenderer, componentType, null, null);
        element = <NgView><any>new TextField();
    });

    it("resolves hyphenated CSS names", () => {
        renderer.setElementStyle(element, "background-color", "red");
        assert.equal(Red, element.style.backgroundColor.hex);
    });

    it("resolves camel-cased JavaScript names", () => {
        renderer.setElementStyle(element, "backgroundColor", "lime");
        assert.equal(Lime, element.style.backgroundColor.hex);
    });

    it("resolves CSS shorthand properties", () => {
        renderer.setElementStyle(element, "font", "12");
        assert.equal(12, element.style.fontSize);
    });
})
