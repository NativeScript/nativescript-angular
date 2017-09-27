import { startServer, stopServer, createDriver, AppiumDriver } from "nativescript-dev-appium";

let driver: AppiumDriver;
before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

afterEach(async function () {
    if (this.currentTest.state === "failed") {
        await driver.logScreenshot(this.currentTest.title);
    }
});

after("stop server", async () => {
    await driver.quit();
    await stopServer();
});
