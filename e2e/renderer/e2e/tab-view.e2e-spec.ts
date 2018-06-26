import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";
import { assert } from "chai";

describe("TabView-scenario", () => {
    let driver: AppiumDriver;

    describe("dynamically change TabView item title, icon and textTransform", async () => {
        let firstTabItem: UIElement;
        let secondTabItem: UIElement;
        let thirdTabItem: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("TabItem Binding", SearchOptions.exact);
            await navigationButton.click();

            await driver.findElementByText("Tab Item Binding", SearchOptions.exact);
        });

        it("should find elements", async () => {
            await driver.findElementByText("First Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = await driver.findElementByText("SELECTED");
            secondTabItem = notSelectedTabItems[0];
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches =  await driver.compareScreen("tab-view-binding-first-tab", 5);
            assert(screenMatches);
        });

        it("should navigate to second tab item", async () => {
            await secondTabItem.click();

            await driver.findElementByText("Second Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = await driver.findElementByText("SELECTED");
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches =  await driver.compareScreen("tab-view-binding-second-tab", 5);
            assert(screenMatches);
        });

        it("should navigate to third tab item", async () => {
            await thirdTabItem.click();

            await driver.findElementByText("Third Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = notSelectedTabItems[1];
            thirdTabItem = await driver.findElementByText("SELECTED");

            const screenMatches =  await driver.compareScreen("tab-view-binding-third-tab", 5);
            assert(screenMatches);
        });
    });
});
