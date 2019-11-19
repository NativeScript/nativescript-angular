import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated
} from "./shared.e2e-spec";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

describe("custom-tabs:", async function () {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        driver.imageHelper.defaultTolerance = 50;
        driver.imageHelper.defaultToleranceType = ImageOptions.pixel;
        screen = new Screen(driver);
    });

    after(async function () {
        if (isSauceRun) {
            driver.sessionId().then(function (sessionId) {
                console.log("Report https://saucelabs.com/beta/tests/" + sessionId);
            });
        }
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("loaded custom tab component and tabs", async function () {
        await screen.navigateCustomTabsPage();
        await screen.loadedCustomTabsPage();
        await screen.loadedPlayersList();
        await gotoTeamsTab(driver);
        await screen.loadedTeamList();
    });

    it("navigate back to login and again to custom tabs", async function () {
        await backRoot(driver);
        await screen.loadedLogin();
        await screen.navigateCustomTabsPage();
        await screen.loadedCustomTabsPage();
        await screen.loadedPlayersList();
        await gotoTeamsTab(driver);
        await screen.loadedTeamList();
    });

    it("navigate to custom tabs player and team details", async function () {
        await gotoPlayersTab(driver);
        await testPlayerNavigated(screen, screen.playerOne);
        await gotoTeamsTab(driver);
        await screen.loadedTeamList();
        await testTeamNavigated(screen, screen.teamOne);
        await backRoot(driver);
        await screen.loadedLogin();
    });
});

async function backRoot(driver: AppiumDriver) {
    const btnBackRoot = await driver.findElementByAutomationText("Root Back");
    await btnBackRoot.tap();
}

async function gotoPlayersTab(driver: AppiumDriver) {
    const btnTabTeams = await driver.findElementByAutomationText("Players Tab");
    await btnTabTeams.tap();
}

async function gotoTeamsTab(driver: AppiumDriver) {
    const btnTabTeams = await driver.findElementByAutomationText("Teams Tab");
    await btnTabTeams.tap();
}
