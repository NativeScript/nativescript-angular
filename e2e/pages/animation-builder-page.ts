import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class AnimationBuilderPage extends BasePage {
    static tapToDisappear: string = "tapToDisappear";
    private _btnTapToDisappear: Promise<UIElement>;
    
    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAutomationText("builder");
        await exampleBtn.click();
    }

    async executeAnimation() {
        this._btnTapToDisappear = this._driver.waitForElement(AnimationBuilderPage.tapToDisappear);
        console.log("Btn tap to disappear should disappear");
        await (await this._btnTapToDisappear).click();
    }

    async waitElementToHide(wait: number) {
        return this.waitElementTo(() => this._btnTapToDisappear, false, wait);
    }
}