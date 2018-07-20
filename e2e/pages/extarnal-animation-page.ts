import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class ExternalAnimationPage extends BasePage{
    constructor(driver: AppiumDriver) {
        super(driver);
     }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("external");
        await exampleBtn.click();
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this._driver.findElementByAccessibilityId("toggleAnimation", 5);
        await btnTapToDisappear.tap();
    }

    animatedBtn() {
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn", 5);
    }

    async waitElementTo(wait: number, shouldBeVisible: boolean) {
        const start = Date.now();
        while ((await this.isBtnDisplayed() !== shouldBeVisible) && Date.now() - start <= wait) {
        }
    }

    async isBtnDisplayed() {
        let btn: UIElement = await this.animatedBtn();
        const isBtnDisplayed = btn ? await btn.isDisplayed() : false;
        return isBtnDisplayed;
    }
}