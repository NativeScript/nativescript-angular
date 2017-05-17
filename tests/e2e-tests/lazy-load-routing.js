"use strict";
var nsAppium = require("nativescript-dev-appium");
var defaultWaitTime = 300000;
describe("lazy load routing", function () {
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
            .waitForElementByAccessibilityId("first-lazy-load", defaultWaitTime)
            .elementByAccessibilityId("first-lazy-load")
                .should.eventually.exist
            .text().should.eventually.equal("First: lazy-load")
    });

    it("navigates and returns", function () {
        var expectedHookLog = [
            "first.init", // <-- load
            "second.init", // <-- forward (first component is not destroyed)
            "second.destroy"] // <-- back (first component is reused)
            .join(",");
        return driver
            .waitForElementByAccessibilityId("first-navigate-lazy-load", defaultWaitTime)
            .elementByAccessibilityId("first-navigate-lazy-load")
                .should.eventually.exist
            .tap()
            .waitForElementByAccessibilityId("second-lazy-load", defaultWaitTime)
            .elementByAccessibilityId("second-lazy-load")
                .should.eventually.exist
                .text().should.eventually.equal("Second: lazy-load")
            .elementByAccessibilityId("router-location-strategy-states-lazy-load")
                .text().should.eventually.equal("/first/lazy-load,/second/lazy-load")
            .elementByAccessibilityId("second-navigate-back-lazy-load")
                .should.eventually.exist
            .tap()
             .waitForElementByAccessibilityId("first-lazy-load", defaultWaitTime)
            .elementByAccessibilityId("first-lazy-load")
                .should.eventually.exist
                .text().should.eventually.equal("First: lazy-load")
            .elementByAccessibilityId("hooks-log-lazy-load")
                .text().should.eventually.equal(expectedHookLog)
    });

    it("navigates and clear history", function() {
        return driver
            .waitForElementByAccessibilityId("first-navigate-lazy-load", defaultWaitTime)
            .elementByAccessibilityId("first-navigate-clear-history-lazy-load")
                .should.eventually.exist
            .tap()
            .waitForElementByAccessibilityId("second-lazy-load", defaultWaitTime)            
            .elementByAccessibilityId("second-lazy-load")
                .should.eventually.exist
                .text().should.eventually.equal("Second: lazy-load")
            .elementByAccessibilityId("router-location-strategy-states-lazy-load")
            .text().should.eventually.equal("/second/lazy-load")
    });
});
