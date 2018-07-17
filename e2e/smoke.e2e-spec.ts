import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";
import { AnimationBuilderPage } from "./helpers/animation-builder-page";
import { ExternalAnimationPage } from "./helpers/extarnal-animation-page";
import { SelectorPage } from "./helpers/selector-page";
import { QueryWithStaggerPage } from "./helpers/query-stagger-page";
import { FadeInOutPage } from "./helpers/fade-in-out-page";
import { AnimationWithOptionsPage } from "./helpers/animation-with-options-page";

describe("smoke-tests", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
        try {
            await driver.navBack();
        } catch (error) {
            await driver.logTestArtifacts(`${this.currentTest.title}_navBack_fail`);
        }
    });

    it("animation builder - btn should disappear", async () => {
        const animationBuilder = new AnimationBuilderPage(driver);
        await animationBuilder.enterExample();
        await animationBuilder.executeAnimation();
        await animationBuilder.waitElementToHide(3000);
        assert.isFalse(await animationBuilder.isBtnDisplayed(), "The btn should disappear");
    });

    it("external animation - visibility", async () => {
        const externalAnimationPage = new ExternalAnimationPage(driver);
        await externalAnimationPage.enterExample();
        await externalAnimationPage.toggleAnimation();
        await externalAnimationPage.waitElementTo(3000, false);
        assert.isFalse(await externalAnimationPage.isBtnDisplayed(), "The button should disappear!");

        await externalAnimationPage.toggleAnimation();
        await externalAnimationPage.waitElementTo(3000, false);
        assert.isTrue(await externalAnimationPage.isBtnDisplayed(), "The button should appear!");
    });

    it("selector", async () => {
        const selectorPage = new SelectorPage(driver);
        await selectorPage.enterExample();
        await selectorPage.addItem();
        await selectorPage.assertElementPossition(4);

        await selectorPage.clickOnItem("second");
        await selectorPage.assertElementPossition(3);
    });

    it("querry with stagger", async () => {
        const queryWithStaggerPage = new QueryWithStaggerPage(driver);
        await queryWithStaggerPage.enterExample();
        await queryWithStaggerPage.addItem();
        await queryWithStaggerPage.assertItemPosition("Item 6", 6, 7);
    });

    it("fade in - out", async () => {
        const fadeInOutPage = new FadeInOutPage(driver);
        await fadeInOutPage.enterExample();
        await fadeInOutPage.toggleAnimation();
        await fadeInOutPage.waitElementTo(3000, false);
        assert.isFalse(await fadeInOutPage.isBtnDisplayed(), "The button should disappear!");

        await fadeInOutPage.toggleAnimation();
        await fadeInOutPage.waitElementTo(3000, false);
        assert.isTrue(await fadeInOutPage.isBtnDisplayed(), "The button should appear!");
    });

    it("animation with options", async () => {
        const animationWithOptionsPage = new AnimationWithOptionsPage(driver);
        await animationWithOptionsPage.enterExample();
        await animationWithOptionsPage.toggleAnimation();
        await animationWithOptionsPage.waitElementTo(3000);
        assert.isFalse(await animationWithOptionsPage.isBtnDisplayed(), "The button should disappear!");

        await animationWithOptionsPage.assertPositionOfToggleAnimationBtn();
    });
});