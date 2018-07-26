import { startServer, stopServer, createDriver } from "nativescript-dev-appium";

let driver;
before("start server", async () => {
    await startServer();
    driver = await createDriver();
});

after("stop server", async () => {
    try {
        await driver.logTestArtifacts("stop_server_log");
        await driver.quit();
    } catch (error) { }
    await stopServer();
});
