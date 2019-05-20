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
        await btnTapToDisappear.click();
    }

    animatedBtn() {
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn");
    }

    async waitElementToToggleVisibility(shouldBeVisible: boolean) {
        return this.waitElementTo(() => this.animatedBtn(), shouldBeVisible, 10000);
    }
}