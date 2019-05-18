import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { BasePage } from "./base-page";

export class AnimateChildPage extends BasePage {
    private _parent: UIElement;
    private _child: UIElement;
    
    constructor(_driver: AppiumDriver) {
        super(_driver)
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("animate-child");
        await exampleBtn.click();
    }

    async waitParentToAppear() {
        this._parent = (await this.awaitItemToAppear("parent")).element;
        const startTime = Date.now();
        while ((await this._parent.location()).x !== 0 && Date.now() - startTime < 3000) { }
    }

    async waitChildToAppear() {
        this._child = (await this.awaitItemToAppear("child")).element;
        const startTime = Date.now();
        while ((await this._child.location()).y !== (await this._parent.location()).y && Date.now() - startTime < 3000) { }
    }

    async assertContainersPosition() {
        assert.isTrue((await this._parent.location()).x === 0);
        assert.isTrue((await this._parent.location()).y === (await this._child.location()).y);
    }

    private async awaitItemToAppear(item: string, wait: number = 3000): Promise<{ isVisible: boolean, element: UIElement }> {
        const findBtn = async () => { return await this._driver.findElementByXPathIfExists(this._elementHelper.findByTextLocator("*", item, true)); };

        return await this.waitElementTo(findBtn, true, wait);;
    }
}