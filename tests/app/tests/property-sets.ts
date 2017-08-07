// make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {View} from "ui/core/view";
import {ViewUtil} from "nativescript-angular/view-util";
import {
    NgView,
    ViewExtensions,
    ViewClassMeta,
    NgElement,
} from "nativescript-angular/element-registry";
import {Red} from "color/known-colors";
import {device, platformNames} from "platform";
import {createDevice} from "./test-utils";

class TestView extends View implements ViewExtensions {
    public previousSibling: NgElement;
    public nextSibling: NgElement;
    public lastChild: NgElement;
    public nodeName: string = "TestView";
    public nodeType: number = 1;
    public templateParent: NgView = null;
    public meta: ViewClassMeta = { skipAddToDom: false };
    public ngCssClasses: Map<string, boolean> = new Map<string, boolean>();

    public stringValue: string = "";
    public numValue: number = 0;
    public boolValue: boolean = undefined;
    public anyValue: any = undefined;
    public nested: { property: string } = { property: "untouched" };
}

const iosDevice = createDevice(platformNames.ios);
const androidDevice = createDevice(platformNames.android);

describe("setting View properties", () => {
    let viewUtil: ViewUtil;
    before(() => {
        viewUtil = new ViewUtil(device);
    });

    it("preserves string values", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "stringValue", "blah");
        assert.equal("blah", view.stringValue);
    });

    it("doesn\'t convert number values", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "numValue", "42");
        assert.strictEqual("42", view.numValue);

        viewUtil.setProperty(view, "numValue", "42.");
        assert.strictEqual("42.", view.numValue);

        viewUtil.setProperty(view, "numValue", 0);
        assert.strictEqual(0, view.numValue);
    });

    it("doesn\'t convert boolean values", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "boolValue", "true");
        assert.strictEqual("true", view.boolValue);
        viewUtil.setProperty(view, "boolValue", "false");
        assert.strictEqual("false", view.boolValue);
    });

    it("sets style values", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "style", "color: red");
        assert.equal(Red, view.style.color.hex);
    });

    it("doesn\'t convert blank strings", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "stringValue", "");
        assert.strictEqual("", view.stringValue);
    });

    it("doesn\'t convert booleans", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "boolValue", true);
        assert.strictEqual(true, view.boolValue);
        viewUtil.setProperty(view, "boolValue", false);
        assert.strictEqual(false, view.boolValue);
    });

    it("preserves objects", () => {
        let value = { name: "Jim", age: 23 };
        let view = new TestView();
        viewUtil.setProperty(view, "anyValue", value);
        assert.deepEqual(value, view.anyValue);
    });

    it("sets nested properties", () => {
        let view = new TestView();
        viewUtil.setProperty(view, "nested.property", "blah");
        assert.strictEqual("blah", view.nested.property);
    });

    it("sets ios property in ios", () => {
        let view = new TestView();
        let testUtil = new ViewUtil(iosDevice);
        testUtil.setProperty(view, "anyValue", "blah", "ios");
        assert.strictEqual("blah", view.anyValue);
    });

    it("doesn\'t set android property in ios", () => {
        let view = new TestView();
        let testUtil = new ViewUtil(iosDevice);
        testUtil.setProperty(view, "anyValue", "blah", "android");
        assert.isUndefined(view.anyValue);
    });

    it("sets android property in android", () => {
        let view = new TestView();
        let testUtil = new ViewUtil(androidDevice);
        testUtil.setProperty(view, "anyValue", "blah", "android");
        assert.strictEqual("blah", view.anyValue);
    });

    it("doesn\'t set ios property in android", () => {
        let view = new TestView();
        let testUtil = new ViewUtil(androidDevice);
        testUtil.setProperty(view, "anyValue", "blah", "ios");
        assert.isUndefined(view.anyValue);
    });
});

