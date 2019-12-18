import {
    AppiumDriver,
    createDriver,
    nsCapabilities,
} from "nativescript-dev-appium";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.

describe("Single page app", async function () {
    let driver: AppiumDriver;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        driver.imageHelper.defaultTolerance = 50;
        driver.imageHelper.defaultToleranceType = ImageOptions.pixel;
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
    
    it("should load first page", async function () {
        await driver.findElementByAutomationText("First Component");

        // ActionBar Title and item
        await driver.findElementByAutomationText("First Title");
        await driver.findElementByAutomationText("ACTION1");
    });

    it("should load second(1) page", async function () {
        await findAndClick(driver, "SECOND(1)");

        await driver.findElementByAutomationText("Second Component: 1");

        // ActionBar Title and item
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
    });

    it("should load second(2) page", async function () {
        await findAndClick(driver, "SECOND(2)");

        await driver.findElementByAutomationText("Second Component: 2");

        // ActionBar Title and items
        await driver.findElementByAutomationText("Second Title");
        await driver.findElementByAutomationText("ACTION2");
        await driver.findElementByAutomationText("ADD");
    });

    it("should open and close modal view", async function () {
        await findAndClick(driver, "Show Modal");

        await driver.findElementByAutomationText("Welcome to modal");
        await findAndClick(driver, "Close Modal");

        await driver.findElementByAutomationText("Second Component: 2");
    });

    it("should go back to second(1) and first", async function () {
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