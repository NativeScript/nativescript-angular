import { AppiumDriver, createDriver, SearchOptions, nsCapabilities } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
    testPlayersNavigated,
    canGoBack
} from "./shared.e2e-spec";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.
const isSauceRun = isSauceLab;

const pages = ["Go To Home Page", "Go To Lazy Home Page"];

describe("split-view:", async function () {
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

    for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        describe(`${page} split-view:`, async function () {

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
                await canGoBack(screen, screen.canGoBackActivatedRoute, true);
            });

            it("should navigate Player One\\Team One then back separately", async function () {
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

            it("should navigate Player One\\Team One then back separately (keep order)", async function () {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await backTeams(driver);
                await screen.loadedTeamList();
                await backPlayers(driver);
                await screen.loadedPlayersList();
            });

            it("should navigate Player One\\Team One then back simultaneously", async function () {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await canGoBack(screen, screen.canGoBackBoth, true);
                await backBoth(driver);
                await canGoBack(screen, screen.canGoBackBoth, false);
                await screen.loadedTeamList();
                await screen.loadedPlayersList();
            });

            it("should navigate Player One\\Team One then next Player/Team then back separately", async function () {
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

            it("should navigate Player One\\Team One then back", async function () {
                await testPlayerNavigated(screen, screen.playerOne);
                await testTeamNavigated(screen, screen.teamOne);
                await back(driver);
                await screen.loadedPlayerDetails(screen.playerOne);
                await screen.loadedTeamList();

                await backPlayers(driver);
                await screen.loadedPlayersList();
            });

            it("should navigate Player One then navigate Players list then back", async function () {
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

            it("should navigate Player One\\Team One then Android back button", async function () {
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
    };
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