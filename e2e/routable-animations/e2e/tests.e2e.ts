import { AppiumDriver, createDriver, SearchOptions, nsCapabilities } from "nativescript-dev-appium";
import { assert } from "chai";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.

describe("sample scenario", function () {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
    });

    after(async function () {
        if (isSauceLab) {
            driver.sessionId().then(function (sessionId) {
                console.log("Report https://saucelabs.com/beta/tests/" + sessionId);
            });
        }
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should go to support page", async function () {
        const btnGoToSupportPage = await driver.findElementByAutomationText("go to support page");
        const homeImage = await driver.compareScreen("home");
        assert.isTrue(homeImage);
        await btnGoToSupportPage.click();
        const titleSupportPage = await driver.findElementByAutomationText("Support Page");
        console.log(await titleSupportPage.text());
    });

    it("should go back to home page", async function () {
        const btnGoBackToHomePage = await driver.findElementByAutomationText("go back to home page");
        const supportImage = await driver.compareScreen("support");
        assert.isTrue(supportImage);
        await btnGoBackToHomePage.click();
        const titleHomePage = await driver.findElementByAutomationText("Home Page");
        console.log(await titleHomePage.text());
    });
});
