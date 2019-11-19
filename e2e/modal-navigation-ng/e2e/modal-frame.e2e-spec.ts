import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screens/screen";
import {
    roots,
    modalFrameBackground,
    testSecondPageBackground,
    testSecondPageClose,
    testNestedModalFrameBackground,
    testNestedModalPageBackground,
    testDialogBackground
} from "./screens/shared-screen";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

describe("modal-frame:", async function () {

    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        driver.imageHelper.defaultTolerance = 50;
        driver.imageHelper.defaultToleranceType = ImageOptions.pixel;
        screen = new Screen(driver);
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

    for (let index = 0; index < roots.length; index++) {
        const root = roots[index];
        describe(`${root} modal frame background scenarios:`, async function () {

            before(async function () {
                nsCapabilities.testReporter.context = this;
                await screen[root]();
            });

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                    await driver.resetApp();
                    await screen[root]();
                }
            });

            after(async function () {
                await screen.closeModal();
                await screen.loadedHome();
            });

            it("should show dialog confirm, run in background", async function () {
                await screen.loadModalFrame(true);
                await testDialogBackground(driver, screen);
            });

            it("should run modal page with frame in background", async function () {
                await screen.loadModalFrame(false);
                await modalFrameBackground(driver, screen);
            });

            it("should navigate to second page, run in background, go back", async function () {
                await screen.loadModalFrame(false);
                await testSecondPageBackground(driver, screen);
            });

            it("should show nested modal page with frame, run in background, close", async function () {
                await screen.loadModalFrame(false);
                await testNestedModalFrameBackground(driver, screen);
            });

            it("should show nested modal page, run in background, close", async function () {
                await screen.loadModalFrame(false);
                await testNestedModalPageBackground(driver, screen);
            });

            it("should navigate to second page, close", async function () {
                await screen.loadModalFrame(false);
                await testSecondPageClose(driver, screen);
            });

            it("should navigate to second page, run in background, go back", async function () {
                await screen.loadModalFrame(true);
                await testSecondPageBackground(driver, screen);
            });
        });
    };
});
