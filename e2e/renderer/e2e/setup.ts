import { startServer, stopServer, createDriver, AppiumDriver } from "nativescript-dev-appium";

let driver: AppiumDriver;

before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

after("stop server", async () => {
    await driver.quit();
    await stopServer();
});