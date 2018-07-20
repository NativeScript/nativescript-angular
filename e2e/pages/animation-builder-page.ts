import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class AnimationBuilderPage extends BasePage{
    static tapToDisappear: string = "tapToDisappear";
    private _btnTapToDisappear: UIElement;
    constructor(driver: AppiumDriver) { 
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("builder");
        await exampleBtn.click();
    }

    async executeAnimation() {
        this._btnTapToDisappear = await this._driver.findElementByAccessibilityId(AnimationBuilderPage.tapToDisappear);
        console.log("Btn tap to disappear should disappear");
        await this._btnTapToDisappear.tap();
    }

    async waitElementToHide(wait: number) {
        const start = Date.now();
        while ((await this._btnTapToDisappear.isDisplayed()) && Date.now() - start <= wait) {
            
        }
    }

    async isBtnDisplayed() {
        return await this._btnTapToDisappear.isDisplayed();
    }
}