import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

import { isOnTheLeft } from "./helpers/location";
import { assert } from "chai";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

describe("Action Bar scenario", async function () {
    let driver: AppiumDriver;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        driver.imageHelper.defaultTolerance = 50;
        driver.imageHelper.defaultToleranceType = ImageOptions.pixel;
        await driver.driver.resetApp();
    });

    after(async function () {
        if (isSauceRun) {
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


    describe("dynamically add\\remove ActionItems", async function () {
        let firstActionItem: UIElement;
        let secondActionItem: UIElement;
        let toggleFirstButton: UIElement;
        let toggleSecondButton: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBar dynamic");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("Action Bar Dynamic Items");
        });

        it("should find elements", async function () {
            firstActionItem = await driver.findElementByAutomationText("one");
            secondActionItem = await driver.findElementByAutomationText("two");

            toggleFirstButton = await driver.findElementByAutomationText("toggle 1");
            toggleSecondButton = await driver.findElementByAutomationText("toggle 2");
        });

        it("should initially render the action items in the correct order", async function () {
            await checkOrderIsCorrect();
        });

        it("should detach first element when its condition is false", done => {
            (async function () {
                await toggleFirst();

                try {
                    await driver.findElementByAutomationText("one");
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach first element in the correct position", async function () {
            await toggleFirst();
            await checkOrderIsCorrect();
        });

        it("should detach second element when its condition is false", done => {
            (async function () {
                await toggleSecond();

                try {
                    await driver.findElementByAutomationText("two");
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach second element in the correct position", async function () {
            await toggleSecond();
            await checkOrderIsCorrect();
        });

        it("should detach and then reattach both at correct places", async function () {
            await toggleFirst();
            await toggleSecond();

            await toggleFirst();
            await toggleSecond();

            await checkOrderIsCorrect();
        });

        const checkOrderIsCorrect = async function () {
            await isOnTheLeft(firstActionItem, secondActionItem);
        };

        const toggleFirst = async function () {
            await toggleFirstButton.click();
        };

        const toggleSecond = async function () {
            await toggleSecondButton.click();
        };

    });

    describe("Action Bar extension with dynamic ActionItem", async function () {
        let toggleButton: UIElement;
        let conditional: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarExtension");
            await navigationButton.click();
        });

        it("should find elements", async function () {
            toggleButton = await driver.findElementByAutomationText("toggle");
            conditional = await driver.findElementByAutomationText("conditional");
        });

        it("should detach conditional action item when its condition is false", async function () {
            await toggle();
            const conditionalBtn = await driver.waitForElement("conditional", 1000);
            assert.isUndefined(conditionalBtn, "Conditional button should not be visible!");
        });

        it("should reattach conditional action item at correct place", async function () {
            await toggle();
            await checkOrderIsCorrect();
        });

        const checkOrderIsCorrect = async function () {
            await isOnTheLeft(toggleButton, conditional);
        };

        const toggle = async function () {
            await toggleButton.click();
        };
    });
});
