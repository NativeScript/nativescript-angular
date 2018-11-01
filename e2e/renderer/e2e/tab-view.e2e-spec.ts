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

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByAutomationText("TabItem Binding");
            await navigationButton.click();

            await driver.findElementByAutomationText("Tab Item Binding");
        });

        it("should find elements", async () => {
            await driver.findElementByAutomationText("First Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = await driver.findElementByAutomationText("SELECTED");
            secondTabItem = notSelectedTabItems[0];
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches = await driver.compareScreen("tab-view-binding-first-tab", 5);
            assert(screenMatches);
        });

        it("should navigate to second tab item", async () => {
            await secondTabItem.click();

            await driver.findElementByAutomationText("Second Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = await driver.findElementByAutomationText("SELECTED");
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches = await driver.compareScreen("tab-view-binding-second-tab", 5);
            assert(screenMatches);
        });

        it("should navigate to third tab item", async () => {
            await thirdTabItem.click();

            await driver.findElementByAutomationText("Third Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = notSelectedTabItems[1];
            thirdTabItem = await driver.findElementByAutomationText("SELECTED");

            const screenMatches = await driver.compareScreen("tab-view-binding-third-tab", 5);
            assert(screenMatches);
        });
    });
});
