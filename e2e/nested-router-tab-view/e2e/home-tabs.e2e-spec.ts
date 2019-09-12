import { AppiumDriver, createDriver, SearchOptions, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated
} from "./shared.e2e-spec";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

const pages = ["Go To Home Page", "Go To Lazy Home Page"];

describe("home-tabs:", async function () {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
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

    for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        describe(`${page} home-tab:`, async function () {

            before(async function () {
                nsCapabilities.testReporter.context = this;
            });

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                }
            });

            it("loaded home component and lists", async function () {
                await screen.navigateToHomePage(page);
                await screen.loadedHome();
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate to Tabs then to About forward", async function () {
                await screen.navigateToTabsPage();
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await screen.navigateToAboutPage();
                await screen.loadedAbout();
                await screen.loadedNestedAbout();
            });

            it("should go back to Tabs and then back to Home", async function () {
                await backActivatedRoute(driver);
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await backActivatedRoute(driver);
                await screen.loadedHome();
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate to Tabs without Players\\Teams navigation", async function () {
                await screen.navigateToTabsPage();
                await screen.loadedTabs();
                await screen.loadedPlayersList();
                await backActivatedRoute(driver);
                await screen.loadedHome();
                await screen.loadedPlayersList();
                await screen.loadedTeamList();
            });

            it("should navigate Player One\\Team One then go to Tabs and back", async function () {
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

            it("should navigate 2 times in Players go to Tabs and back", async function () {
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
    };
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
