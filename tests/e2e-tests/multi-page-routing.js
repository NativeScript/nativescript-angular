"use strict";
var nsAppium = require("nativescript-dev-appium");

describe("multi page routing", function () {
    this.timeout(40000);
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
            .elementByAccessibilityId("first-multi-page")
                .should.eventually.exist
            .text().should.eventually.equal("First: multi-page")
    });

    it("navigates and returns", function () {
        var expectedHookLog = [
            "first.activate first null",
            "first.deactivate second first",
            "second.activate second first",
            "second.deactivate first second",
            "first.activate first second"].join(",");
        return driver
            .elementByAccessibilityId("first-navigate-multi-page")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("second-multi-page")
                .should.eventually.exist
            .text().should.eventually.equal("Second: multi-page")
            .elementByAccessibilityId("second-navigate-multi-page")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("first-multi-page")
                .should.eventually.exist
                .text().should.eventually.equal("First: multi-page")
            .elementByAccessibilityId("hooks-log-multi-page")
                .text().should.eventually.equal(expectedHookLog)
    });
});
