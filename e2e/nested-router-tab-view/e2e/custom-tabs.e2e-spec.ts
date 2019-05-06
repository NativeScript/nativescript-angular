import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
} from "./shared.e2e-spec"

describe("custom-tabs:", async function () {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        screen = new Screen(driver);
    });

    after(async function () {
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

    it("navigate back to login and again to custom tabs", async function () {
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
