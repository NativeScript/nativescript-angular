import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen, sharedModalView, homeComponent } from "./screens/screen";
import {
    assertComponent,
    goBack,
    navigateToSecondComponent
} from "./screens/shared-screen";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const roots = [
    "setTabRootViewModal",
    "setFrameRootViewModal",
    "setNamedFrameRootViewModal",
];
const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

describe("modal-on-init:", async function () {
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
        describe("Shared Modal on Init", async function () {
            before(async function () {
                nsCapabilities.testReporter.context = this;
                await screen[root]();
                console.log(`Root: ${root}`);
            });

            beforeEach(async function () { });

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                    await driver.resetApp();
                    await screen[root]();
                }
            });

            after("root after all hook", async function () {
                await driver.logTestArtifacts(`${root}_root_after_all_hook`);
            });

            it("should shared modal view", async function () {
                await assertComponent(driver, sharedModalView);
            });

            it("run in background", async function () {
                await driver.backgroundApp(1);
                await assertComponent(driver, sharedModalView);
            });

            it("should close shared modal ", async function () {
                await screen.closeModal();
                await screen.loadedHome();
            });

            it("should open\\close shared modal", async function () {
                await screen.loadSharedModal(true);
                await screen.closeModal();
                await screen.loadedHome();
            });

            it("should open\\close shared modal again", async function () {
                await screen.loadSharedModal(true);
                if (driver.isAndroid) {
                    await driver.navBack();
                } else {
                    await screen.closeModal();
                }
                await screen.loadedHome();
            });

            it("should open\\close modal with frame", async function () {
                await screen.loadModalFrame(true);
                await screen.closeModal();
            });

            it("should open\\close shared modal again", async function () {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("run in background again", async function () {
                await driver.backgroundApp(1);
                await screen.loadedHome();
            });

            it("should open\\close shared modal second", async function () {
                await screen.loadModalFrame(true);
                await screen.closeModal();
            });
        });
    };

    describe("Shared Modal on Init", async function () {
        const root = "setLayoutRootViewModal";
        before(async function () {
            nsCapabilities.testReporter.context = this;
            await screen[root]();
            console.log(`Root: ${root}`);
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
                await driver.resetApp();
                await screen[root]();
            }
        });

        after("root after all hook", async function () {
            await driver.logTestArtifacts(`${root}_root_after_all_hook`);
        });

        it("should shared modal view", async function () {
            await assertComponent(driver, sharedModalView);
        });

        it("run in background", async function () {
            await driver.backgroundApp(1);
            await assertComponent(driver, sharedModalView);
        });

        it("should close shared modal ", async function () {
            await screen.closeModal();
            await screen.loadedHome();
        });

        it("should open\\close shared modal", async function () {
            await screen.loadModalFrame(true);
            await screen.closeModal();
        });

        it("run in background again", async function () {
            await driver.backgroundApp(1);
            await screen.loadedHome();
        });

        it("should open\\close shared modal second", async function () {
            await screen.loadModalFrame(true);
            await screen.closeModal();
        });

        it("should open\\close shared modal", async function () {
            await screen.loadSharedModal(true);
            await screen.closeModal();
        });
    });
});
