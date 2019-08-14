import { AppiumDriver, Point, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { BasePage } from "./base-page";

export class AnimationWithOptionsPage extends BasePage {
    private initialPositionOfAnimatedBtn: Point

    constructor(driver: AppiumDriver) {
        super(driver);
    }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("options");
        await exampleBtn.click();
        this.initialPositionOfAnimatedBtn = await (await this.animatedBtn()).location();
    }

    async btnToggleAnimation() {
        return await this._driver.findElementByAccessibilityId("toggleAnimation");
    }

    async animatedBtn() {
        await this._driver.findElementsByAccessibilityId("animatedBtn", 10000);
        return await this._driver.findElementByAccessibilityIdIfExists("animatedBtn");
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this.btnToggleAnimation();
        await btnTapToDisappear.click();
    }

    async waitElementToHide() {
        return await this.waitElementTo(() => this.animatedBtn(), false, 10000);
    }

    async assertPositionOfToggleAnimationBtn() {
        await this.waitElementTo(() => this.btnToggleAnimation(), true, 5000);
        const point: Point = await (await this.btnToggleAnimation()).location();
        assert.isTrue(point.y === this.initialPositionOfAnimatedBtn.y);
    }
}