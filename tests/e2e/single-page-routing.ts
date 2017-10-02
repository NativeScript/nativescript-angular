import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import { ImageHelper } from "./helpers/image-helper";


describe("single page routing", function () {
    let driver: AppiumDriver;
    let imageHelper: ImageHelper;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
        imageHelper = new ImageHelper(driver);
    });

    afterEach("clear image results", () => {
        imageHelper.reset();
    });

    it("navigates and returns", async () => {
        let btn = (await driver.findElementByAccessibilityId("first-navigate-single-page"));
        await btn.tap();
        await imageHelper.compareScreen("first-single-page-screen");

        btn = await driver.findElementByAccessibilityId("second-navigate-back-single-page");
        await btn.tap();
        await imageHelper.compareScreen("second-navigate-back-single-page-screen");

        imageHelper.assertImages();
    });

    it("navigates and returns with clear history", async () => {
        let btn = (await driver.findElementByAccessibilityId("first-navigate-clear-history-single-page"));
        await btn.click();
        await imageHelper.compareScreen("first-navigate-clear-history-single-page-screen");

        await driver.navBack();
        await imageHelper.compareScreen("second-navigate-back-single-page-screen");

        imageHelper.assertImages();
    });
});
