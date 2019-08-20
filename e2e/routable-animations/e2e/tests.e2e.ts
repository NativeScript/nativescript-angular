import { AppiumDriver, createDriver, SearchOptions, nsCapabilities } from "nativescript-dev-appium";
import { assert } from "chai";

describe("sample scenario", () => {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;

    before(async function () {
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
    });

    after(async function () {
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
