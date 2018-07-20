import { AppiumDriver } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class FadeInOutPage extends BasePage {
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("fade-in-out");
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