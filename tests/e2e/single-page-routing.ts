import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";

describe("single page routing", function () {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();        
    });

    it("loads default path", async function () {
        const result = await driver.compareScreen("loadsDefaultPath", 1, 0.01);
        assert.isTrue(result);
    });

    it("navigates and returns", async function () {
        let btn = (await driver.findElementByAccessibilityId("first-single-page"));
        await btn.tap();
        let result = await driver.compareScreen("first-single-page", 1, 0.01);
        assert.isTrue(result, `First-single-page page screen is not correct!`);

        btn = await driver.findElementByAccessibilityId("Single-page router");
        await btn.tap();
        result = await driver.compareScreen("second-navigate-back-single-page", 1, 0.01);
        assert.isTrue(result, `Second-navigate-back-single-page screen is not correct!!!`);

        btn = await driver.findElementByAccessibilityId("first-single-page");
        await btn.tap();
        result = await driver.compareScreen("first-single-page-after-nav", 1, 0.01);
        assert.isTrue(result, `First-single-page screen is not correct!!!`);
    });
});
