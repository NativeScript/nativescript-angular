import { startServer, stopServer, createDriver, AppiumDriver } from "nativescript-dev-appium";

let driver: AppiumDriver;

before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

after("stop server", async () => {
    await stopServer();
});

afterEach(async function () {
    if (this.currentTest.state === "failed") {
        await driver.logScreenshoot(this.currentTest.title);
    }
});