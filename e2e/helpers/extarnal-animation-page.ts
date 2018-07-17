import { AppiumDriver, UIElement } from "nativescript-dev-appium";

export class ExternalAnimationPage {
    constructor(private _driver: AppiumDriver) { }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("external");
        await exampleBtn.click();
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this._driver.findElementByAccessibilityId("toggleAnimation");
        await btnTapToDisappear.tap();
    }

    animatedBtn() {
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn");
    }

    async waitElementTo(wait: number, shouldBeVisible: boolean) {
        const start = Date.now();
        while (await this.isBtnDisplayed() === shouldBeVisible && Date.now() - start <= wait) {
        }
    }

    async isBtnDisplayed() {
        let btn = await this.animatedBtn();
        const isBtnDisplayed = btn ? await btn.isDisplayed() : false;
        return isBtnDisplayed;
    }
}