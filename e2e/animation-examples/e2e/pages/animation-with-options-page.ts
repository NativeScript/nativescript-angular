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
        this.initialPositionOfAnimatedBtn = await (await this.animatedBtn).location();
    }

    get btnToggleAnimation() {
        return this._driver.findElementByAccessibilityId("toggleAnimation");
    }

    get animatedBtn() {
        this._driver.findElementsByAccessibilityId("animatedBtn", 10000);
        return this._driver.findElementByAccessibilityIdIfExists("animatedBtn");
    }

    async toggleAnimation() {
        const btnTapToDisappear = await this.btnToggleAnimation;
        await btnTapToDisappear.click();
    }

    async waitElementToHide() {
        return this.waitElementTo(() => this.animatedBtn, false, 10000);
    }

    async assertPositionOfToggleAnimationBtn() {
        this.waitElementTo(() => this.btnToggleAnimation, true, 5000);
        const point: Point = await (await this.btnToggleAnimation).location();
        assert.isTrue(point.y === this.initialPositionOfAnimatedBtn.y);
    }
}