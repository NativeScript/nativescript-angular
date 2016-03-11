//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {bootstrap} from "../nativescript-angular/application";
import {Component} from "angular2/core";
import {View} from "ui/core/view";
import {setProperty} from "../nativescript-angular/view-util";
import {NgView, ViewExtensions, ViewClassMeta} from "../nativescript-angular/element-registry";
import {Red} from "color/known-colors";

class TestView extends View implements ViewExtensions {
    public nodeName: string = "TestView";
    public templateParent: NgView = null;
    public meta: ViewClassMeta = { skipAddToDom: false };
    public cssClasses: Map<string, boolean> = new Map<string, boolean>();

    public stringValue: string = "";
    public numValue: number = 0;
    public boolValue: boolean = undefined;
    public anyValue: any = undefined;
}

describe('setting View properties', () => {
    it('preserves string values', () => {
        let view = new TestView();
        setProperty(view, "stringValue", "blah")
        assert.equal("blah", view.stringValue);
    });

    it('converts number values', () => {
        let view = new TestView();
        setProperty(view, "numValue", "42")
        assert.strictEqual(42, view.numValue);
        setProperty(view, "numValue", 0)
        assert.strictEqual(0, view.numValue);
    });

    it('converts boolean values', () => {
        let view = new TestView();
        setProperty(view, "boolValue", "true")
        assert.strictEqual(true, view.boolValue);
        setProperty(view, "boolValue", "false")
        assert.strictEqual(false, view.boolValue);
    });

    it('sets style values', () => {
        let view = new TestView();
        setProperty(view, "style", "color: red")
        assert.equal(Red, view.style.color.hex);
    });

    it('doesn\'t convert blank strings', () => {
        let view = new TestView();
        setProperty(view, "stringValue", "")
        assert.strictEqual("", view.stringValue);
    });

    it('doesn\'t convert booleans', () => {
        let view = new TestView();
        setProperty(view, "boolValue", true)
        assert.strictEqual(true, view.boolValue);
        setProperty(view, "boolValue", false)
        assert.strictEqual(false, view.boolValue);
    });

    it('preserves objects', () => {
        let value = {name: "Jim", age: 23};
        let view = new TestView();
        setProperty(view, "anyValue", value)
        assert.deepEqual(value, view.anyValue);
    });
});
