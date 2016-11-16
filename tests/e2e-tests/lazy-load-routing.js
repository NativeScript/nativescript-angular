"use strict";
var nsAppium = require("nativescript-dev-appium");

describe("lazy load routing", function () {
    this.timeout(360000);
    var driver;

    before(function () {
        var caps = {
            browserName: '',
            'appium-version': '1.6',
            platformName: 'Android',
            platformVersion: '4.4.4',
            deviceName: 'Android Emulator',
            app: undefined // will be set later
        };
        driver = nsAppium.createDriver(caps);
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
            .waitForElementByAccessibilityId("first-lazy-load", 300000)
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
            .waitForElementByAccessibilityId("first-navigate-lazy-load", 300000)
            .elementByAccessibilityId("first-navigate-lazy-load")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("second-lazy-load")
                .should.eventually.exist
            .text().should.eventually.equal("Second: lazy-load")
            .elementByAccessibilityId("second-navigate-back-lazy-load")
                .should.eventually.exist
            .tap()
            .elementByAccessibilityId("first-lazy-load")
                .should.eventually.exist
                .text().should.eventually.equal("First: lazy-load")
            .elementByAccessibilityId("hooks-log-lazy-load")
                .text().should.eventually.equal(expectedHookLog)
    });
});
