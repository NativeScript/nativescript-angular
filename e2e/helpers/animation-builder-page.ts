import { AppiumDriver, UIElement } from "nativescript-dev-appium";

export class AnimationBuilderPage {
    static tapToDisappear: string = "tapToDisappear";
    private _btnTapToDisappear: UIElement;
    constructor(private _driver: AppiumDriver) { }

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