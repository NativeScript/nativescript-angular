import { AppiumDriver, createDriver, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
} from "./shared.e2e-spec"

describe("tab-view:", async function () {
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

    it("loaded home component and lists", async function () {
        await screen.navigateToHomePage();
        await screen.loadedHome();
        await screen.loadedPlayersList();
        await screen.loadedTeamList();
    });

    it("loaded tabs component, Players List and Teams List pages", async function () {
        await screen.navigateToTabsPage();
        await screen.loadedTabs();
        await screen.loadedPlayersList();
        await gotoTeamsTab(driver);
        await screen.loadedTeamList();
        await gotoPlayersTab(driver);
        await screen.loadedPlayersList();
    });

    it("should navigate Player One/Team One then back separately", async function () {
        this.retries(2);
        await testPlayerNavigated(screen, screen.playerOne);
        await gotoTeamsTab(driver);
        await testTeamNavigated(screen, screen.teamOne);
        await backTeams(driver);
        await screen.loadedTeamList();
        await gotoPlayersTab(driver);
        await backPlayers(driver);
        await screen.loadedPlayersList();
    });

    it("should navigate Player One/Team One then next Player/Team then back", async function () {
        await testPlayerNavigated(screen, screen.playerOne);
        await testPlayerNextNavigated(screen, screen.playerTwo);
        await gotoTeamsTab(driver);
        await testTeamNavigated(screen, screen.teamOne);
        await testTeamNextNavigated(screen, screen.teamTwo);
        await gotoPlayersTab(driver);
        await backPlayers(driver);
        await screen.loadedPlayerDetails(screen.playerOne);
        await gotoTeamsTab(driver);
        await backTeams(driver);
        await screen.loadedTeamDetails(screen.teamOne);
        await backTeams(driver);
        await screen.loadedTeamList();
        await gotoPlayersTab(driver);
        await backPlayers(driver);
        await screen.loadedPlayersList();
    });
});

async function gotoPlayersTab(driver: AppiumDriver) {
    const btnTabPlayers = await driver.findElementByAutomationText("Players Tab");
    await btnTabPlayers.tap();
}

async function gotoTeamsTab(driver: AppiumDriver) {
    const btnTabTeams = await driver.findElementByAutomationText("Teams Tab");
    await btnTabTeams.tap();
}

async function backTeams(driver: AppiumDriver) {
    const btnBackTeams = await driver.findElementByAutomationText("Back-Teams");
    await btnBackTeams.tap();
}

async function backPlayers(driver: AppiumDriver) {
    const btnBackPlayers = await driver.findElementByAutomationText("Back-Players");
    await btnBackPlayers.tap();
}
