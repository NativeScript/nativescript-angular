import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { sort } from "../helper/utils";
import { BasePage } from "./base-page";

export class SelectorPage extends BasePage {
    private _btnAddItem: UIElement;
    private _itemsContainerXpath;
    private _itemsContainerChildrenXpath;

    constructor(_driver: AppiumDriver) {
        super(_driver);
        this._itemsContainerXpath = this._elementHelper.getXPathByTextAtributes("//*", "itemsContainer", true);
        this._itemsContainerChildrenXpath = `${this._itemsContainerXpath}/*`
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("selector");
        await exampleBtn.click();
    }

    async addItem() {
        this._btnAddItem = await this._driver.findElementByText("ADD");
        await this._btnAddItem.click();
    }

    async clickOnItem(item: string) {
        const btn = await this._driver.findElementByXPath(this.itemXpath(item));

        await btn.click();
    }

    async waitItemToToggleVisibility(item: string, visibility: boolean) {
        return this.waitElementTo(() => this._driver.findElementByXPathIfExists(this.itemXpath(item)), visibility, 5000);
    }

    async getChildren() {
        const children: Array<UIElement> = await this._driver.findElementsByXPath(this._itemsContainerChildrenXpath);
        const orderedList: Array<UIElement> = await sort(children);

        return orderedList;
    }

    async assertElementPossition(expctedElementsCount: number) {
        const children = await this.getChildren();
        assert.isTrue(children.length === expctedElementsCount)
        for (let index = 0; index < children.length - 1; index++) {
            const element = children[index];
            const el = await (<any>element.driver()).elementByXPathIfExists(this._elementHelper.getXPathByTextAtributes("//*", `Item No.${index}`, true));
            console.log(await el.text());
            assert.isTrue(el && el !== null);
        }
    }

    private itemXpath(item) {
        return `${this._itemsContainerXpath}${this._elementHelper.getXPathByTextAtributes("//*", item, false)}`;
    }
}