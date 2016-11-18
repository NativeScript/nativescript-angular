"use strict";
var nsAppium = require("nativescript-dev-appium");

describe("single page routing", function () {
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
            .waitForElementByAccessibilityId("first-single-page", 300000)
            .elementByAccessibilityId("first-single-page")
                .should.eventually.exist
            .text().should.eventually.equal("First: single-page")
    });

    it("navigates and returns", function () {
        var expectedHookLog = [
            "first.init", // <--load
            "first.destroy", // <--forward
            "second.init",
            "second.destroy", // <--back
            "first.init"].join(",");

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
