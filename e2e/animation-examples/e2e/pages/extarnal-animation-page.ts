import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class ExternalAnimationPage extends BasePage {
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.waitForElement("external");
        await exampleBtn.click();
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this._driver.waitForElement("toggleAnimation");
        await btnTapToDisappear.click();
    }

    animatedBtn() {
        return this._driver.waitForElement("animatedBtn");
    }

    async waitElementToToggleVisibilityTo(shouldBeVisible: boolean) {
        return this.waitElementTo(() => this.animatedBtn(), shouldBeVisible, 10000);
    }
}