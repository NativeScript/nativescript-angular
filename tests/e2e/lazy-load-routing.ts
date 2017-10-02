import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import { ImageHelper } from "./helpers/image-helper"

describe("lazy load routing", async function () {
    let driver: AppiumDriver;
    let imageHelper: ImageHelper;
    const lazyLoadedDisplay = "lazyLoadedDisplay";

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
        imageHelper = new ImageHelper(driver);
    });

    afterEach("clear image results", () => {
        imageHelper.reset();
    });

    it("navigates and returns", async () => {
        await (await driver.findElementByAccessibilityId("first-navigate-lazy-load")).tap();
        imageHelper.compareScreen("first-navigate-lazy-load-screen");

        const btn = await driver.findElementByAccessibilityId("second-navigate-back-lazy-load");
        btn.tap();
        imageHelper.compareScreen("second-navigate-back-lazy-load-screen");

        imageHelper.assertImages();
    });

    it("navigates and clear history", async () => {
        await (await driver.findElementByAccessibilityId("first-navigate-clear-history-lazy-load")).tap();
        imageHelper.compareScreen("first-navigate-clear-history-lazy-load-screen");

        await driver.navBack();
        imageHelper.compareScreen("first-navigate-clear-history-lazy-load-nav-back-sceen");

        imageHelper.assertImages();
    });
});
