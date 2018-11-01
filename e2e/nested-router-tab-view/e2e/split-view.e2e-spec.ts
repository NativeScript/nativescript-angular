import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
    testPlayersNavigated,
    canGoBack
} from "./shared.e2e-spec"

const pages = ["Go To Home Page", "Go To Lazy Home Page"];

describe("split-view:", () => {
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
        describe(`${page} split-view:`, () => {

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
                await canGoBack(screen, screen.canGoBackActivatedRoute, true);
            });

            it("should navigate Player One/Team One then back separately", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await canGoBack(screen, screen.canGoBackPlayers, true);
                await canGoBack(screen, screen.canGoBackTeams, true);
                await backPlayers(driver);
                await screen.loadedPlayersList();
                await backTeams(driver);
                await canGoBack(screen, screen.canGoBackTeams, false);
                await screen.loadedTeamList();
            });

            it("should navigate Player One/Team One then back separately (keep order)", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await backTeams(driver);
                await screen.loadedTeamList();
                await backPlayers(driver);
                await screen.loadedPlayersList();
            });

            it("should navigate Player One/Team One then back simultaneously", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await canGoBack(screen, screen.canGoBackBoth, true);
                await backBoth(driver);
                await canGoBack(screen, screen.canGoBackBoth, false);
                await screen.loadedTeamList();
                await screen.loadedPlayersList();
            });

            it("should navigate Player One/Team One then next Player/Team then back separately", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await testPlayerNextNavigated(screen, screen.playerTwo);
                await testTeamNextNavigated(screen, screen.teamTwo);

                await backPlayers(driver);
                await screen.loadedPlayerDetails(screen.playerOne);
                await backTeams(driver);
                await screen.loadedTeamDetails(screen.teamOne);
                await backBoth(driver);
                await screen.loadedTeamList();
                await screen.loadedPlayersList();
            });

            it("should navigate Player One/Team One then back", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await back(driver);
                await screen.loadedPlayerDetails(screen.playerOne);
                await screen.loadedTeamList();

                await backPlayers(driver);
                await screen.loadedPlayersList();
            });

            it("should navigate Player One then navigate Players list then back", async () => {
                await testPlayerNavigated(screen, screen.playerOne);
                await testPlayerNextNavigated(screen, screen.playerTwo);
                await testPlayersNavigated(screen);
                await back(driver);
                await screen.loadedPlayerDetails(screen.playerTwo);
                await back(driver);
                await screen.loadedPlayerDetails(screen.playerOne);
                await back(driver);
                await screen.loadedPlayersList();
            });

            it("should navigate Player One/Team One then Android back button", async () => {
                if (driver.isAndroid) {
                    await testPlayerNavigated(screen, screen.playerOne);
                    await testTeamNavigated(screen, screen.teamOne);
                    await driver.navBack();
                    await screen.loadedPlayerDetails(screen.playerOne);
                    await screen.loadedTeamList();

                    await backPlayers(driver);
                    await screen.loadedPlayersList();
                }
            });

            it("should navigate Player One then navigate Players list then Android back button", async function () {
                if (driver.isAndroid) {
                    await testPlayerNavigated(screen, screen.playerOne);
                    await testPlayerNextNavigated(screen, screen.playerTwo);
                    await testPlayersNavigated(screen);
                    await driver.navBack();
                    await screen.loadedPlayerDetails(screen.playerTwo);
                    await driver.navBack();
                    await screen.loadedPlayersList();
                }
            });

            it("should not navigate back when no back stack available", async function () {
                await backTeams(driver);
                await screen.loadedTeamList();
                await backPlayers(driver);
                await screen.loadedPlayersList();
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

async function back(driver: AppiumDriver) {
    const btnBack = await driver.findElementByAutomationText("Back()");
    await btnBack.tap();
}

async function backPlayers(driver: AppiumDriver) {
    const btnBackPlayers = await driver.findElementByAutomationText("Back(Players)");
    await btnBackPlayers.tap();
}

async function backTeams(driver: AppiumDriver) {
    const btnBackTeams = await driver.findElementByAutomationText("Back(Teams)");
    await btnBackTeams.tap();
}

async function backBoth(driver: AppiumDriver) {
    const btnBackBoth = await driver.findElementByAutomationText("Back(Both)");
    await btnBackBoth.tap();
}