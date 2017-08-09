const nsAppium = require("nativescript-dev-appium");

describe("sample scenario", () => {
    const defaultWaitTime = 5000;
    let driver;

    before(async () => {
        driver = nsAppium.createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    it("should go to support page", async () => {
        const xPathBtnGoToSupportPage = nsAppium.getXPathWithExactText("go to support page");
        const btnGoToSupportPage = await driver.waitForElementByXPath(xPathBtnGoToSupportPage, defaultWaitTime);
        await btnGoToSupportPage.click();
        const titleSupportPage = await driver.waitForElementByXPath(nsAppium.getXPathContainingsText("Support Page"), defaultWaitTime);
        console.log(await titleSupportPage.text());
    });

    it("should go back to home page", async () => {
        const xPathBtnGoBackToHomePage = nsAppium.getXPathWithExactText("go back to home page");
        const btnGoBackToHomePage = await driver.waitForElementByXPath(xPathBtnGoBackToHomePage, defaultWaitTime);
        await btnGoBackToHomePage.click();
        const titleHomePage = await driver.waitForElementByXPath(nsAppium.getXPathContainingsText("Home Page"), defaultWaitTime);
        console.log(await titleHomePage.text());
    });
});
