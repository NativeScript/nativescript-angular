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
        await findAndClick(driver, "SECOND(1)")

        await driver.findElementByAutomationText("Second Component: 1");
        
        // ActionBar Title and item
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
    });

    it("should load second(2) page", async () => {
        await findAndClick(driver, "SECOND(2)")

        await driver.findElementByAutomationText("Second Component: 1");
        
        // ActionBar Title and items
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
        await driver.findElementByAutomationText("ADD");
    });
});

async function findAndClick(driver: AppiumDriver, text: string) {
    const navigationButton =
        await driver.findElementByAutomationText(text);
    navigationButton.click();
}