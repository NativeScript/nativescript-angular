import * as setup from "nativescript-dev-appium";
import * as portastic from "portastic";

before("setup server", async () => {
    console.log("Setting up server");
    const port = 9191;
    await setup.startAppiumServer(port);
    console.log("Server is started");
});

before("setup driver", async () => {
    console.log("Setting up driver");
});

after("kill driver", async () => {
    console.log("Kill driver");
});

after("kill server", async () => {
    await setup.killAppiumServer();
    console.log("Server stopped");
});