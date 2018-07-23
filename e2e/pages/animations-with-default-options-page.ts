import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { sort } from "../helper/utils";
import { BasePage } from "./base-page";

export class AnimationsWithDefaultOptionsPage extends BasePage {
    private _btnAddItem: UIElement;
    private _children: Array<UIElement>;
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("options-default");
        await exampleBtn.click();
        this._children = await this.getChildren();
    }

    async addItem() {
        this._btnAddItem = await this._driver.findElementByAccessibilityId("add");

        await this._btnAddItem.click();
    }

    async clickOnItem(item: string) {
        const btn = await this.getItem(item);

        await btn.click();
    }

    private getItem(item) {
        return this._driver.findElementByXPathIfExists(`${this._elementHelper.getXPathByTextAtributes("//*", "itemsContainer", true)}${this._elementHelper.getXPathByTextAtributes("//*", item, false)}`);
    }

    async awaitItemToDissapear(item: string, wait: number = 3000) {
        const startTime = Date.now();
        let btn = await this.getItem(item);
        while (btn && await btn.isDisplayed() && Date.now() - startTime <= wait) {
            btn = await this.getItem(item);
        }

        this._children = await this.getChildren();
    }

    async awaitItemToAppear(item: string, wait: number = 3000) {
        const startTime = Date.now();
        let btn = await this.getItem(item);
        while (!btn && !(await btn.isDisplayed()) && Date.now() - startTime <= wait) {
            btn = await this.getItem(item);
        }

        this._children = await this.getChildren();
    }

    async getChildren() {
        const children: Array<UIElement> = await this._driver.findElementsByXPath(`${this._elementHelper.getXPathByTextAtributes("//*", "itemsContainer", true)}/*`);
        const orderedList: Array<UIElement> = await sort(children);

        return orderedList;
    }

    async assertItemPosition(text: string, itemIndex: number, expctedElementsCount: number) {
        const children = this._children;

        assert.isTrue(children.length === expctedElementsCount, `Expected items count: ${expctedElementsCount} is not as actual: ${children.length}`);
        const element = children[itemIndex];
        console.log("Element text: ", await element.text());
        const currentElementText = await element.text();
        assert.isTrue(currentElementText.toLowerCase() === text.toLowerCase(), `Expected element text: ${text} at position: ${itemIndex} is not as actual: ${currentElementText}!`);
    }
}