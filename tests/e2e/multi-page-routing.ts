import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import {  initialDisplayName } from "./const";

describe("multi page routing", async () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();        
    });

    it("navigates and returns", async () => {
        let btn = await driver.findElementByAccessibilityId("first-navigate-multi-page");
        await btn.tap();
        let result = await driver.compareScreen("multiPage", 1, 0.01);
        assert.isTrue(result, `Multi page screen is not correct!`);

        btn = await driver.findElementByAccessibilityId("second-navigate-back-multi-page");
        await btn.tap();
        result = await driver.compareScreen("multiPageInitialDisplay",1,0.01);
        assert.isTrue(result, `Init screen is not correct!!!`);
    });
});
