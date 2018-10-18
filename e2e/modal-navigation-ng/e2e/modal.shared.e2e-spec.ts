import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

const homeComponent = "Home Component";

describe("Shared modal from home and back", () => {
    let driver: AppiumDriver;

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

    it ("should find home component", async () => {
        await assertComponent(driver, homeComponent);
    });

    it("should open/close shared modal from home component", async () => {
        await openModal(driver);
        await closeModal(driver);
    });

    it ("should find home component again", async () => {
        await assertComponent(driver, homeComponent);
    });
});

describe("Shared modal from second and back", () => {
    let driver: AppiumDriver;

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
            await driver.logPageSource(this.currentTest.title);
            await driver.logScreenshot(this.currentTest.title);
        }
    });

    it ("should find home component", async () => {
        await assertComponent(driver, homeComponent);
    });

    it ("should navigate to second component", async() => {
        await navigateToSecondComponent(driver);
    });

    it ("should find second component", async () => {
        await assertComponent(driver, "second component");
    });

    it("should open/close shared modal from second component", async () => {
        await openModal(driver);
        await closeModal(driver);
    });

    it ("should find second component again", async () => {
        await assertComponent(driver, "second component");
    });
});

describe("Shared modal from different components", () => {
    let driver: AppiumDriver;

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
            await driver.logPageSource(this.currentTest.title);
            await driver.logScreenshot(this.currentTest.title);
        }
    });

    it ("should find home component", async () => {
        await assertComponent(driver, homeComponent);
    });

    it("should open/close shared modal from home component", async () => {
        await openModal(driver);
        await closeModal(driver);
    });

    it ("should find home component again", async () => {
        await assertComponent(driver, homeComponent);
    });

    it ("should navigate to second component", async() => {
        await navigateToSecondComponent(driver);
    });

    it ("should find second component", async () => {
        await assertComponent(driver, "second component");
    });

    it("should open/close shared modal from second component", async () => {
        await openModal(driver);
        await closeModal(driver);
    });

    it ("should find second component again", async () => {
        await assertComponent(driver, "second component");
    });

    it ("should navigate back to home component", async () => {
        await goBack(driver);
        await assertComponent(driver, homeComponent);
    });

    it("should open/close shared modal from home component after manipulations with second", async () => {
        await openModal(driver);
        await closeModal(driver);
    });

    it ("should find home component again", async () => {
        await assertComponent(driver, homeComponent);
    });
});

async function assertComponent(driver: AppiumDriver, message: string) {
    const lbl = await driver.findElementByText(message, SearchOptions.exact);
    assert.isTrue(await lbl.isDisplayed());
}

async function navigateToSecondComponent(driver: AppiumDriver) {
    const navigateBtnTap = await driver.findElementByText("go to second (to open shared modal)", SearchOptions.exact);
    await navigateBtnTap.click();
}

async function openModal(driver: AppiumDriver) {
    const btnTap = await driver.findElementByText("show shared modal", SearchOptions.exact);
    await btnTap.click();
}

async function closeModal(driver: AppiumDriver) {
    const closeBtnTap = await driver.findElementByText("close modal", SearchOptions.exact);
    await closeBtnTap.click();
}

async function goBack(driver: AppiumDriver) {
    const backBtnTap = await driver.findElementByText("go back", SearchOptions.exact);
    await backBtnTap.click();
}
