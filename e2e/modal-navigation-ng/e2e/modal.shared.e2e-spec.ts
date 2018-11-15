import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { Screen } from "./screens/screen"
import { assertComponent, goBack, navigateToSecondComponent } from "./screens/shared-screen";

const homeComponent = "Home Component";
const roots = ["setFrameRootView", "setTabRootView"];

describe("modal-shared:", () => {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async () => {
        driver = await createDriver();
        screen = new Screen(driver);
    });

    roots.forEach(root => {
        describe("Shared modal from second and back", () => {

            before(async () => {
                await screen[root]();
            });

            beforeEach(async function () {
            });

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                    await driver.resetApp();
                    await screen[root]();
                }
            });

            it("should find home component", async () => {
                await assertComponent(driver, homeComponent);
            });

            it("should open/close shared modal from home component", async () => {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should open/close shared modal from home component again", async () => {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should find home component again", async () => {
                await assertComponent(driver, homeComponent);
            });

            it("should navigate to second component", async () => {
                await navigateToSecondComponent(driver);
            });

            it("should find second component", async () => {
                await assertComponent(driver, "second component");
            });

            it("should open/close shared modal from second component", async () => {
                await screen.loadSharedModal(true);
                await screen.closeModal();
            });

            it("should find second component again", async () => {
                await assertComponent(driver, "second component");
            });

            it("should navigate back to home component", async () => {
                await goBack(driver);
                await assertComponent(driver, homeComponent);
            });
        });
    });

    describe("modal-shared-different-component:", () => {
        let driver: AppiumDriver;
        let screen: Screen;
    
        before(async () => {
            driver = await createDriver();
            screen = new Screen(driver);
        });
    
        roots.forEach(root => {
            describe("Shared modal from different components", () => {
                before(async () => {
                    driver = await createDriver();
                    await driver.resetApp();
                });
    
                after(async () => {
                    await driver.quit();
                    console.log("Quit driver!");
                });
    
                afterEach(async function () {
                    if (this.currentTest.state === "failed") {
                        await driver.logTestArtifacts(this.currentTest.title);
                    }
                });
    
                it("should find home component", async () => {
                    await screen.loadedHome();
                });
    
                it("should open/close shared modal from home component", async () => {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });
    
                it("should find home component again", async () => {
                    await screen.loadedHome();
                });
    
                it("should navigate to second component", async () => {
                    await navigateToSecondComponent(driver);
                });
    
                it("should find second component", async () => {
                    await assertComponent(driver, "second component");
                });
    
                it("should open/close shared modal from second component", async () => {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });
    
                it("should find second component again", async () => {
                    await assertComponent(driver, "second component");
                });
    
                it("should navigate back to home component", async () => {
                    await goBack(driver);
                    await screen.loadedHome();
                });
    
                it("should open/close shared modal from home component after manipulations with second", async () => {
                    await screen.loadSharedModal(true);
                    await screen.closeModal();
                });
    
                it("should find home component again", async () => {
                    await screen.loadedHome();
                });
            });
        });
    });
});

