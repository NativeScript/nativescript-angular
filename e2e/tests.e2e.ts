import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

describe("sample scenario", () => {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should go to support page", async () => {
        const btnGoToSupportPage = await driver.findElementByText("go to support page", SearchOptions.exact);
        const homeImage = await driver.compareScreen("home");
        assert.isTrue(homeImage);
        await btnGoToSupportPage.click();
        const titleSupportPage = await driver.findElementByText("Support Page", SearchOptions.exact);
        console.log(await titleSupportPage.text());
    });

    it("should go back to home page", async () => {
        const btnGoBackToHomePage = await driver.findElementByText("go back to home page", SearchOptions.exact);
        const supportImage = await driver.compareScreen("support");
        assert.isTrue(supportImage);
        await btnGoBackToHomePage.click();
        const titleHomePage = await driver.findElementByText("Home Page", SearchOptions.exact);
        console.log(await titleHomePage.text());
    });
});
