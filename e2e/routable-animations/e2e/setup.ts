import { startServer, stopServer } from "nativescript-dev-appium";

before("start server", async function () {
    await startServer();
});

after("stop server", async function () {
    await stopServer();
});
