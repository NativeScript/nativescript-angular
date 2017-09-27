import { startServer, stopServer, createDriver, AppiumDriver } from "nativescript-dev-appium";

let driver: AppiumDriver;
before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

afterEach(async function () {
    if (this.currentTest.state === "failed") {
        const fullName = await this.currentTest.fullTitle();
        await driver.logScreenshot(fullName);
        await driver.logPageSource(fullName);
    }
});

after("stop server", async () => {
    await driver.quit();
    await stopServer();
});
