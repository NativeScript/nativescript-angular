import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class AnimationBuilderPage extends BasePage {
    static tapToDisappear: string = "tapToDisappear";

    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAutomationText("builder");
        await exampleBtn.click();
    }

    async executeAnimation() {
        const btnTapToDisappear = await this._driver.waitForElement(AnimationBuilderPage.tapToDisappear);
        console.log("Btn tap to disappear should disappear");
        await btnTapToDisappear.click();
    }

    async waitElementToHide(wait: number) {
        return this.waitElementTo(() => this._driver.waitForElement(AnimationBuilderPage.tapToDisappear), false, wait);
    }
}