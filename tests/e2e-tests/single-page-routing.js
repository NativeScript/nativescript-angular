"use strict";
var nsAppium = require("nativescript-dev-appium");

describe("single page routing", function () {
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
            .elementByAccessibilityId("first-single-page")
                .should.eventually.exist
            .text().should.eventually.equal("First: single-page")
    });

    it("navigates and returns", function () {
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
    });
});
