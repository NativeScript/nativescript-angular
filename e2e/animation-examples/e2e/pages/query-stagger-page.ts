import { AppiumDriver, UIElement, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";
import { sort } from "../helper/utils";
import { BasePage } from "./base-page";

export class QueryWithStaggerPage extends BasePage {
    private _btnAddItem: UIElement;
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("query-stagger");
        await exampleBtn.click();
    }

    async addItem() {
        this._btnAddItem = await this._driver.findElementByText("ADD", SearchOptions.contains);

        await this._btnAddItem.click();
    }

    async getChildren() {
        const children: Array<UIElement> = await this._driver.findElementsByXPath(`${this._elementHelper.getXPathByTextAtributes("//*", "container", true)}/*`);
        const orderedList: Array<UIElement> = await sort(children);

        return orderedList;
    }

    async assertItemPosition(text: string, itemIndex: number, expctedElementsCount: number) {
        const startTime = Date.now();
        let item = await this._driver.findElementByTextIfExists(text)
        while ((!item || !(await item.isDisplayed())) && Date.now() - startTime <= 3000) { }
        const children = await this.getChildren();
        assert.isTrue(children.length === expctedElementsCount);
        const element = children[itemIndex];
        const elementText = await element.text();
        console.log("Element text: ", elementText);

        assert.isTrue(elementText.toLowerCase() === text.toLowerCase());
    }
}