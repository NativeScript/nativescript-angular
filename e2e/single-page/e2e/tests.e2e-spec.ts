import {
    AppiumDriver,
    UIElement,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

describe("Simple navigate and back", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
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