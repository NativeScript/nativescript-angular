import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";
import { assert } from "chai";

describe("page-router-outlet-scenario", async function () {
    let driver: AppiumDriver;

    describe("actionBarVisibility 'always' shows action bars", async function () {
        before(async function () {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarVisibility Always");
            await navigationButton.click();

            await driver.findElementByAutomationText("ShowActionBar");
        });

        it("should not hide action bar by default", async function () {
            const screenMatches = await driver.compareScreen("actionBarVisibility-always-default", 5);
            assert(screenMatches);
        });

        it("should not hide action bar when hidden by page", async function () {
            const hideActionBarButton = await driver.findElementByAutomationText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-always-hidden", 5);
            assert(screenMatches);
        });

        it("should not do anything when shown action bar by page", async function () {
            const showActionBarButton = await driver.findElementByAutomationText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-always-shown", 5);
            assert(screenMatches);
        });
    });

    describe("actionBarVisibility 'never' doesn't show action bars", async function () {
        before(async function () {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarVisibility Never");
            await navigationButton.click();

            await driver.findElementByAutomationText("ShowActionBar");
        });

        it("should hide action bar by default", async function () {
            const screenMatches = await driver.compareScreen("actionBarVisibility-never-default", 5);
            assert(screenMatches);
        });

        it("should not show action bar when shown by page", async function () {
            const showActionBarButton = await driver.findElementByAutomationText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-never-shown", 5);
            assert(screenMatches);
        });

        it("should not do anything when hidden action bar by page", async function () {
            const hideActionBarButton = await driver.findElementByAutomationText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-never-hidden", 5);
            assert(screenMatches);
        });
    });

    describe("actionBarVisibility 'never' doesn't show action bars in lazy module page", async function () {
        let imagePostFix = "";
        before(async function () {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
            if (driver.isIOS && driver.nsCapabilities.device.name.toLowerCase().includes("x")) {
                imagePostFix = "-lazy";
            }
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarVisibility Never Lazy");
            await navigationButton.click();

            await driver.findElementByAutomationText("ShowActionBar");
        });

        it("should hide action bar by default", async function () {
            const screenMatches = await driver.compareScreen(`actionBarVisibility-never-default${imagePostFix}`, 5);
            assert(screenMatches);
        });

        it("should not show action bar when shown by page", async function () {
            const showActionBarButton = await driver.findElementByAutomationText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches = await driver.compareScreen(`actionBarVisibility-never-shown${imagePostFix}`, 5);
            assert(screenMatches);
        });

        it("should not do anything when hidden action bar by page", async function () {
            const hideActionBarButton = await driver.findElementByAutomationText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches = await driver.compareScreen(`actionBarVisibility-never-hidden${imagePostFix}`, 5);
            assert(screenMatches);
        });
    });

    describe("actionBarVisibility 'auto' shows action bars based on page", async function () {
        before(async function () {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarVisibility Auto");
            await navigationButton.click();

            await driver.findElementByAutomationText("ShowActionBar");
        });

        it("should show action bar by default", async function () {
            const screenMatches = await driver.compareScreen("actionBarVisibility-auto-default", 5);
            assert(screenMatches);
        });

        it("should hide action bar when hidden by page", async function () {
            const hideActionBarButton = await driver.findElementByAutomationText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-auto-hidden", 5);
            assert(screenMatches);
        });

        it("should show action bar when shown by page", async function () {
            const showActionBarButton = await driver.findElementByAutomationText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches = await driver.compareScreen("actionBarVisibility-auto-shown", 5);
            assert(screenMatches);
        });
    });
});
