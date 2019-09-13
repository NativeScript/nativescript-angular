import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screens/screen"
import {
    roots,
    testNestedModalPageBackground,
    testDialogBackground,
} from "./screens/shared-screen";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

describe("modal-layout:", async function () {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
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
        describe(`${root} modal no frame background scenarios:`, async function () {
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

            it("should show nested modal page, run in background, close", async function () {
                await screen.loadModalNoFrame(true);
                await testNestedModalPageBackground(driver, screen, false);

            });

            it("should show dialog confirm inside modal view with no frame, run in background", async function () {
                await screen.loadModalNoFrame(false);
                await testDialogBackground(driver, screen, false);
            });
        });
    };
});
