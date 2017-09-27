import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";

describe("single page routing", function () {
    this.timeout(360000);
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    it("loads default path", async function () {
        const result = await driver.compareScreen("loadsDefaultPath", 1, 0.01);
        assert.isTrue(result);
    });

    it("navigates and returns", async function () {
        var expectedHookLog = [
            "first.init", // <--load
            "first.destroy", // <--forward
            "second.init",
            "second.destroy", // <--back
            "first.init"].join(",");

        await driver.click("first-single-page");

        return driver
            .waitForElementByAccessibilityId("first-single-page", 300000)
            .elementByAccessibilityId("first-navigate-single-page")
            .should.eventually.exist
            .tap()
            .elementByAccessibilityId("second-single-page")
            .should.eventually.exist
            .text().should.eventually.equal("Second: single-page")
            .elementByAccessibilityId("second-navigate-back-single-page")
            .should.eventually.exist
            .tap()
            .elementByAccessibilityId("first-single-page")
            .should.eventually.exist
            .text().should.eventually.equal("First: single-page")
            .elementByAccessibilityId("hooks-log-single-page")
            .text().should.eventually.equal(expectedHookLog)
    });
});
