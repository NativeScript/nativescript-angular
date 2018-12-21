import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { Screen } from "./screens/screen"
import {
    roots,
    testNestedModalPageBackground,
    testDialogBackground,
} from "./screens/shared-screen"

describe("modal-layout:", () => {

    let driver: AppiumDriver;
    let screen: Screen;

    before(async () => {
        driver = await createDriver();
        screen = new Screen(driver);
    });

    roots.forEach(root => {
        describe(`${root} modal no frame background scenarios:`, () => {
            before(async () => {
                await screen[root]();
            });

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                    await driver.resetApp();
                    await screen[root]();
                }
            });

            after(async () => {
                await screen.closeModal();
                await screen.loadedHome();
            });

            it("should show nested modal page, run in background, close", async () => {
                await screen.loadModalNoFrame(true);
                await testNestedModalPageBackground(driver, screen, false);

            });

            it("should show dialog confirm inside modal view with no frame, run in background", async () => {
                await screen.loadModalNoFrame(false);
                await testDialogBackground(driver, screen, false);
            });
        });
    });
});
