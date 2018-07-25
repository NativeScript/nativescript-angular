import { startServer, stopServer, createDriver } from "nativescript-dev-appium";

let driver;
before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

after("stop server", async () => {
    try {
        await driver.logTestArtifacts(this.currentTest.title);
        await driver.quit();
    } catch (error) { }
    await stopServer();
});
