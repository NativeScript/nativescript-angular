//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {TextField} from "ui/text-field";
import {Red, Lime} from "color/known-colors";
import { NativeScriptRendererFactory, NativeScriptRenderer } from "nativescript-angular/renderer";
import {NativeScriptAnimationDriver} from "nativescript-angular/animation-driver";
import {device} from "platform";
import { ViewEncapsulation, RendererTypeV2, RendererV2 } from "@angular/core";
import {NgView} from "nativescript-angular/view-util";

describe("Setting style properties", () => {
    let renderer: NativeScriptRenderer = null;
    let element: NgView = null;

    beforeEach(() => {
        const rendererFactory = new NativeScriptRendererFactory(null, device, null);
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
})
