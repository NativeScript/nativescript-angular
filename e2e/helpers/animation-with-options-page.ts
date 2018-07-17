import { AppiumDriver, UIElement, Point } from "nativescript-dev-appium";
import { assert } from "chai";

export class AnimationWithOptionsPage {
    constructor(private _driver: AppiumDriver) { }
    private initialPositionOfAnimatedBtn: Point
    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("options");
        await exampleBtn.click();
        this.initialPositionOfAnimatedBtn = await (await this.animatedBtn).location();
    }

    get btnToggleAnimation() {
        return this._driver.findElementByAccessibilityId("toggleAnimation");
    }

    get animatedBtn() {
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn");
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this.btnToggleAnimation;
        await btnTapToDisappear.tap();
    }

    async waitElementTo(wait: number) {
        const start = Date.now();
        while (await this.isBtnDisplayed() === false && Date.now() - start <= wait) {
        }
    }

    async isBtnDisplayed() {
        let btn = await this.animatedBtn;
        const isBtnDisplayed = btn ? await btn.isDisplayed() : false;
        return isBtnDisplayed;
    }

    async assertPositionOfToggleAnimationBtn(){
        const point: Point = await (await this.btnToggleAnimation).location();
        assert.isTrue(point.y === this.initialPositionOfAnimatedBtn.y);
    }
}