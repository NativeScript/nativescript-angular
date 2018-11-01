import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
    testPlayersNavigated,
    canGoBack,
    testTeamsNavigated
} from "./shared.e2e-spec"

const pages = ["Go To Home Page", "Go To Lazy Home Page"];

describe("home-tabs:", () => {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async () => {
        driver = await createDriver();
        screen = new Screen(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    pages.forEach(page => {
        describe(`${page} home-tab:`, () => {

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                }
            });

            it("loaded home component and lists", async () => {
                await screen.navigateToHomePage(page);
                await screen.loadedHome();
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate to Tabs then to About forward", async () => {
                if (driver.isIOS) {
                    await screen.navigateToTabsPage();
                    await screen.loadedTabs();
                    await screen.loadedPlayersList();
                    await screen.navigateToAboutPage();
                    await screen.loadedAbout();
                }
            });

            it("should go back to Tabs and then back to Home", async () => {
                if (driver.isIOS) {
                    await backActivatedRoute(driver);
                    await screen.loadedTabs();
                    await screen.loadedPlayersList();
                    await backActivatedRoute(driver);
                    await screen.loadedHome();
                    await screen.loadedPlayersList();
                    await screen.loadedTeamList();
                }
            });

            it("should navigate to Tabs without Players/Teams navigation", async () => {
                await screen.navigateToTabsPage();
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await backActivatedRoute(driver);
                await screen.loadedHome();
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate Player One/Team One then go to Tabs and back", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await screen.navigateToTabsPage();
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await gotoTeamsTab(driver);
                await screen.loadedTeamList();
                await backActivatedRoute(driver);
                await screen.loadedHome();
                await screen.loadedPlayerDetails(screen.playerOne);
                await screen.loadedTeamDetails(screen.teamOne);
                await backBoth(driver);
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate 2 times in Players go to Tabs and back", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testPlayerNextNavigated(screen, screen.playerTwo);
                await screen.navigateToTabsPage();
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await gotoTeamsTab(driver);
                await screen.loadedTeamList();
                await backActivatedRoute(driver);
                await screen.loadedHome();
                await screen.loadedPlayerDetails(screen.playerTwo);
                await screen.loadedTeamList();
                await backPlayers(driver);
                await screen.loadedPlayerDetails(screen.playerOne);
                await backPlayers(driver);
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate back to Login page with back(activatedRoute)", async function () {
                await backActivatedRoute(driver);
                await screen.loadedLogin;
            });
        });
    });
});

async function backActivatedRoute(driver: AppiumDriver) {
    const btnBack = await driver.findElementByAutomationText("Back(ActivatedRoute)");
    await btnBack.tap();
}

async function backPlayers(driver: AppiumDriver) {
    const btnBackPlayers = await driver.findElementByAutomationText("Back(Players)");
    await btnBackPlayers.tap();
}

async function backBoth(driver: AppiumDriver) {
    const btnBackBoth = await driver.findElementByAutomationText("Back(Both)");
    await btnBackBoth.tap();
}

async function gotoPlayersTab(driver: AppiumDriver) {
    const btnTabPlayers = await driver.findElementByAutomationText("Players Tab");
    await btnTabPlayers.tap();
}

async function gotoTeamsTab(driver: AppiumDriver) {
    const btnTabTeams = await driver.findElementByAutomationText("Teams Tab");
    await btnTabTeams.tap();
}
