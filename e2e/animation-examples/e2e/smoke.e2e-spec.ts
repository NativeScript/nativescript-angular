import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { assert } from "chai";
import { AnimationBuilderPage } from "./pages/animation-builder-page";
import { ExternalAnimationPage } from "./pages/extarnal-animation-page";
import { SelectorPage } from "./pages/selector-page";
import { QueryWithStaggerPage } from "./pages/query-stagger-page";
import { FadeInOutPage } from "./pages/fade-in-out-page";
import { AnimationWithOptionsPage } from "./pages/animation-with-options-page";
import { AnimationsWithDefaultOptionsPage } from "./pages/animations-with-default-options-page";
import { AnimateChildPage } from "./pages/animate-child-page";
import { HeroPage } from "./pages/hero-page";

describe("smoke-tests", async function () {
    let driver: AppiumDriver;

    before(async function () {
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
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

    it("animation builder - btn should disappear", async function () {
        const animationBuilder = new AnimationBuilderPage(driver);
        await animationBuilder.enterExample();
        await animationBuilder.executeAnimation();
        const result = await animationBuilder.waitElementToHide(driver.defaultWaitTime);
        assert.isFalse(!result || result.isVisible, "The btn should disappear");
    });

    it("external animation - visibility", async function () {
        this.retries(1);
        const externalAnimationPage = new ExternalAnimationPage(driver);
        await externalAnimationPage.enterExample();
        await externalAnimationPage.toggleAnimation();
        let result = await externalAnimationPage.waitElementToToggleVisibilityTo(false);
        assert.isFalse(result.isVisible, "The button should disappear!");

        await externalAnimationPage.toggleAnimation();
        result = await externalAnimationPage.waitElementToToggleVisibilityTo(true);
        assert.isTrue(result.isVisible, "The button should appear!");
    });

    it("selector", async function () {
        const selectorPage = new SelectorPage(driver);
        await selectorPage.enterExample();
        await selectorPage.addItem();
        await selectorPage.waitItemToToggleVisibility("Item No.2", true);
        await selectorPage.assertElementPosition(4);

        await selectorPage.clickOnItem("second");
        await selectorPage.waitItemToToggleVisibility("second", false);
        await selectorPage.assertElementPosition(3);
    });

    it("query with stagger", async function () {
        const queryWithStaggerPage = new QueryWithStaggerPage(driver);
        await queryWithStaggerPage.enterExample();
        await queryWithStaggerPage.addItem();
        await queryWithStaggerPage.assertItemPosition("Item 6", 6, 7);
    });

    it("fade in - out", async function () {
        this.retries(1);
        const fadeInOutPage = new FadeInOutPage(driver);
        await fadeInOutPage.enterExample();
        await fadeInOutPage.toggleAnimation();
        let result = await fadeInOutPage.waitElementToToggleVisibility(false);
        assert.isFalse(result.isVisible, "The button should disappear!");

        await fadeInOutPage.toggleAnimation();
        result = await fadeInOutPage.waitElementToToggleVisibility(true);
        assert.isTrue(result.isVisible, "The button should appear!");
    });

    it("animation with options", async function () {
        const animationWithOptionsPage = new AnimationWithOptionsPage(driver);
        await animationWithOptionsPage.enterExample();
        await animationWithOptionsPage.toggleAnimation();
        const result = await animationWithOptionsPage.waitElementToHide();
        assert.isUndefined(result, "The button should disappear!");

        await animationWithOptionsPage.assertPositionOfToggleAnimationBtn();
    });

    it("animation with default options", async function () {
        const animationWithOptionsPage = new AnimationsWithDefaultOptionsPage(driver);
        await animationWithOptionsPage.enterExample();
        let examplesCount = 5;
        await animationWithOptionsPage.assertItemPosition("Harley Quinn", 1, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Wonder Woman", 2, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Joker", 3, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Aquaman", 4, examplesCount);

        await animationWithOptionsPage.clickOnItem("Harley Quinn");
        examplesCount--;
        await animationWithOptionsPage.awaitItemToDisappear("Harley Quinn");
        await animationWithOptionsPage.assertItemPosition("Wonder Woman", 1, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Joker", 2, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Aquaman", 3, examplesCount);

        await animationWithOptionsPage.addItem();
        examplesCount++;
        await animationWithOptionsPage.awaitItemToAppear("Harley Quinn");
        await animationWithOptionsPage.assertItemPosition("Wonder Woman", 1, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Joker", 2, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Aquaman", 3, examplesCount);
        await animationWithOptionsPage.assertItemPosition("Harley Quinn", 4, examplesCount);
    });

    it("animate child", async function () {
        this.retries(1);
        const animateChildPage = new AnimateChildPage(driver);
        await animateChildPage.enterExample();
        await animateChildPage.waitParentToAppear();
        await animateChildPage.waitChildToAppear();
        await animateChildPage.assertContainersPosition();
    });

    it("angular docs", async function () {
        const heroPage = new HeroPage(driver);
        await heroPage.enterExample();
        await heroPage.addActive();
        let result = await driver.compareScreen("add_active_items", 5, 0.01);

        await heroPage.addInactive();
        result = await driver.compareScreen("add_inactive_items", 5, 0.01) && result;

        await heroPage.remove();
        result = await driver.compareScreen("add_remove_items", 5, 0.01) && result;

        await heroPage.reset();
        result = await driver.compareScreen("add_reset_items", 5, 0.01) && result;

        assert.isTrue(result, "Image verification failed!");

    });
});