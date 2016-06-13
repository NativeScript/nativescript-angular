"use strict";
var nsAppium = require("nativescript-dev-appium");

describe("single page routing", function () {
    this.timeout(120000);
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
            .elementByAccessibilityId("first-single-page")
                .should.eventually.exist
            .text().should.eventually.equal("First: single-page")
    });

    it("navigates, returns and fires hooks", function () {
        var expectedHookLog = [
            "first.activate first null",
            "first.deactivate second first",
            "second.activate second first",
            "second.deactivate first second",
            "first.activate first second"].join(",");


        return driver
            .elementByAccessibilityId("first-navigate-single-page")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("second-single-page")
                .should.eventually.exist
            .text().should.eventually.equal("Second: single-page")
            .elementByAccessibilityId("second-navigate-single-page")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("first-single-page")
                .should.eventually.exist
            .text().should.eventually.equal("First: single-page")
            .elementByAccessibilityId("hooks-log-single-page")
                .text().should.eventually.equal(expectedHookLog)
    });
});
