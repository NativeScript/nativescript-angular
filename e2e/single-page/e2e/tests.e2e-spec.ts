import {
    AppiumDriver,
    createDriver,
} from "nativescript-dev-appium";

describe("Single page app", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    it("should load first page", async () => {
        await driver.findElementByAutomationText("First Component");

        // ActionBar Title and item
        await driver.findElementByAutomationText("First Title");
        await driver.findElementByAutomationText("ACTION1");
    });

    it("should load second(1) page", async () => {
        await findAndClick(driver, "SECOND(1)");

        await driver.findElementByAutomationText("Second Component: 1");

        // ActionBar Title and item
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
    });

    it("should load second(2) page", async () => {
        await findAndClick(driver, "SECOND(2)");

        await driver.findElementByAutomationText("Second Component: 2");

        // ActionBar Title and items
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
        await driver.findElementByAutomationText("ADD");
    });

    it("should open and close modal view", async () => {
        await findAndClick(driver, "Show Modal");

        await driver.findElementByAutomationText("Welcome to modal");
        await findAndClick(driver, "Close Modal");

        await driver.findElementByAutomationText("Second Component: 2");
    });

    it("should go back to second(1) and first", async () => {
        await findAndClick(driver, "Back");
        await driver.findElementByAutomationText("Second Component: 1");
        await findAndClick(driver, "Back");
        await driver.findElementByAutomationText("First Title");
        await driver.findElementByAutomationText("ACTION1");
    });
});

async function findAndClick(driver: AppiumDriver, text: string) {
    const navigationButton = await driver.findElementByAutomationText(text);
    await navigationButton.click();
}