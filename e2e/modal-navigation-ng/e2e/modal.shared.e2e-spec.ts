import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screens/screen"
import { assertComponent, goBack, navigateToSecondComponent } from "./screens/shared-screen";

const homeComponent = "Home Component";
const roots = ["setFrameRootView", "setTabRootView"];

describe("modal-shared:", async function () {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        screen = new Screen(driver);
    });

    for (let index = 0; index < roots.length; index++) {
        const root = roots[index];
        describe("Shared modal from home component and back", async function () {

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

            it("should find home component", async function () {
                await assertComponent(driver, homeComponent);
            });

            it("should open/close shared modal from home component", async function () {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should open/close shared modal from home component again", async function () {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should open/close shared modal with presentation style from home component", async function () {
                await screen.loadSharedModalWithPresentationStyle(true);
                await screen.closeModal();
            });

            it("should find home component again", async function () {
                await screen.loadedHome();
            });

            it("should navigate to second component", async function () {
                await navigateToSecondComponent(driver);
            });

            it("should find second component", async function () {
                await assertComponent(driver, "second component");
            });

            it("should open/close shared modal from second component", async function () {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should find second component again", async function () {
                await assertComponent(driver, "second component");
            });

            it("should navigate back to home component", async function () {
                await goBack(driver);
                await assertComponent(driver, homeComponent);
            });
        });
    };

    describe("modal-shared-different-component:", async function () {
        let driver: AppiumDriver;
        let screen: Screen;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            screen = new Screen(driver);
        });

        for (let index = 0; index < roots.length; index++) {
            const root = roots[index];
            describe("Shared modal from different components", async function () {
                before(async function () {
                    nsCapabilities.testReporter.context = this;
                    driver = await createDriver();
                    await driver.resetApp();
                });

                after(async function () {
                    await driver.quit();
                    console.log("Quit driver!");
                });

                afterEach(async function () {
                    if (this.currentTest.state === "failed") {
                        await driver.logTestArtifacts(this.currentTest.title);
                    }
                });

                it("should find home component", async function () {
                    await screen.loadedHome();
                });

                it("should open/close shared modal from home component", async function () {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });

                it("should find home component again", async function () {
                    await screen.loadedHome();
                });

                it("should navigate to second component", async function () {
                    await navigateToSecondComponent(driver);
                });

                it("should find second component", async function () {
                    await assertComponent(driver, "second component");
                });

                it("should open/close shared modal from second component", async function () {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });

                it("should find second component again", async function () {
                    await assertComponent(driver, "second component");
                });

                it("should navigate back to home component", async function () {
                    await goBack(driver);
                    await screen.loadedHome();
                });

                it("should open/close shared modal from home component after manipulations with second", async function () {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });

                it("should find home component again", async function () {
                    await screen.loadedHome();
                });
            });
        };
    });
});

