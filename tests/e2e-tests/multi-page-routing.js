"use strict";
var nsAppium = require("nativescript-dev-appium");
var defaultWaitTime = 300000;

describe("multi page routing", function () {
    this.timeout(360000);
    var driver;

    before(function () {
        driver = nsAppium.createDriver();
    });

    after(function () {
        return driver
            .quit()
            .finally(function () {
                console.log("Driver quit successfully");
            });
    });

    it("loads default path", function () {
        return driver
            .waitForElementByAccessibilityId("first-multi-page", 300000)
            .elementByAccessibilityId("first-multi-page")
            .should.eventually.exist
            .text().should.eventually.equal("First: multi-page")
    });

    it("navigates and returns", function () {
        var expectedHookLog = [
            "first.init", // <-- load
            "second.init", // <-- forward (first component is not destroyed)
            "second.destroy"] // <-- back (first component is reused)
            .join(",");
        return driver
            .waitForElementByAccessibilityId("first-navigate-multi-page", defaultWaitTime)
            .elementByAccessibilityId("first-navigate-multi-page")
            .should.eventually.exist
            .tap()
            .waitForElementByAccessibilityId("second-multi-page", defaultWaitTime)
            .elementByAccessibilityId("second-multi-page")
            .should.eventually.exist
            .text().should.eventually.equal("Second: multi-page")
            .elementByAccessibilityId("second-navigate-back-multi-page")
            .should.eventually.exist
            .tap()
            .waitForElementByAccessibilityId("first-multi-page", defaultWaitTime)
            .elementByAccessibilityId("first-multi-page")
            .should.eventually.exist
            .text().should.eventually.equal("First: multi-page")
            .elementByAccessibilityId("hooks-log-multi-page")
            .text().should.eventually.equal(expectedHookLog)
    });
});
