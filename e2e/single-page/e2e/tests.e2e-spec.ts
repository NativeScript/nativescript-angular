import {
    AppiumDriver,
    UIElement,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

describe("Single page app", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should load first page", async () => {
        await driver.findElementByText("First Component", SearchOptions.exact);

        // ActionBar Title and item
        await driver.findElementByText("First Title", SearchOptions.exact);
        await driver.findElementByText("ACTION1", SearchOptions.exact);
    });

    it("should load second(1) page", async () => {
        await findAndClick(driver, "SECOND(1)")

        await driver.findElementByText("Second Component: 1", SearchOptions.exact);
        
        // ActionBar Title and item
        await driver.findElementByText("Second Title", SearchOptions.exact);
        await driver.findElementByText("ACTION2", SearchOptions.exact);
    });

    it("should load second(2) page", async () => {
        await findAndClick(driver, "SECOND(2)")

        await driver.findElementByText("Second Component: 1", SearchOptions.exact);
        
        // ActionBar Title and items
        await driver.findElementByText("Second Title", SearchOptions.exact);
        await driver.findElementByText("ACTION2", SearchOptions.exact);
        await driver.findElementByText("ADD", SearchOptions.exact);
    });
});

async function assureFirstComponent(driver: AppiumDriver) {
    await driver.findElementByText("First Component", SearchOptions.exact);
}

async function findAndClick(driver: AppiumDriver, text: string) {
    const navigationButton =
        await driver.findElementByText(text, SearchOptions.exact);
    navigationButton.click();
}