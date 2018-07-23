import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class ExternalAnimationPage extends BasePage {
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("external");
        await exampleBtn.click();
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this._driver.findElementByAccessibilityId("toggleAnimation", 5);
        await btnTapToDisappear.click();
    }

    animatedBtn() {
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn", 5);
    }

    async waitElementToToggleVisibilityTo(shouldBeVisible: boolean) {
        return this.waitElementTo(() => this.animatedBtn(), shouldBeVisible, 10000);
    }
}