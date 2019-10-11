import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";
import { assert } from "chai";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.

describe("TabView-scenario", async function(){
    let driver: AppiumDriver;

    before(async function(){
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.driver.resetApp();
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

    describe("dynamically change TabView item title, icon and textTransform", async function(){
        let firstTabItem: UIElement;
        let secondTabItem: UIElement;
        let thirdTabItem: UIElement;

        it("should navigate to page", async function(){
            const navigationButton =
                await driver.findElementByAutomationText("TabItem Binding");
            await navigationButton.click();

            await driver.findElementByAutomationText("Tab Item Binding");
        });

        it("should find elements", async function(){
            await driver.findElementByAutomationText("First Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = await driver.findElementByAutomationText("SELECTED");
            secondTabItem = notSelectedTabItems[0];
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches = await driver.compareScreen("tab-view-binding-first-tab", 5, 50, ImageOptions.pixel);
            assert(screenMatches);
        });

        it("should navigate to second tab item", async function(){
            await secondTabItem.click();

            await driver.findElementByAutomationText("Second Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = await driver.findElementByAutomationText("SELECTED");
            thirdTabItem = notSelectedTabItems[1];

            const screenMatches = await driver.compareScreen("tab-view-binding-second-tab", 5, 50, ImageOptions.pixel);
            assert(screenMatches);
        });

        it("should navigate to third tab item", async function(){
            await thirdTabItem.click();

            await driver.findElementByAutomationText("Third Tab");

            const notSelectedTabItems = await driver.findElementsByText("not selected");

            firstTabItem = notSelectedTabItems[0];
            secondTabItem = notSelectedTabItems[1];
            thirdTabItem = await driver.findElementByAutomationText("SELECTED");

            const screenMatches = await driver.compareScreen("tab-view-binding-third-tab", 5, 50, ImageOptions.pixel);
            assert(screenMatches);
        });
    });
});
