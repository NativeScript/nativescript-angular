import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { sort } from "./utils";

export class QueryWithStaggerPage {
    private _btnAddItem: UIElement;
    constructor(private _driver: AppiumDriver) { }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("query-stagger");
        await exampleBtn.click();
    }

    async addItem() {
        this._btnAddItem = await this._driver.findElementByAccessibilityId("ADD");

        await this._btnAddItem.tap();
    }

    async getChildren() {
        const children: Array<UIElement> = await this._driver.findElementsByXPath('//*[@name="container"]/*');
        const orderedList: Array<UIElement> = await sort(children);

        return orderedList;
    }

    async assertItemPosition(text: string, itemIndex: number, expctedElementsCount: number) {
        const children = await this.getChildren();
        assert.isTrue(children.length === expctedElementsCount);
        const element = children[itemIndex];
        console.log("Element text: ", await element.text());

        assert.isTrue(await element.text() === text);
    }
}