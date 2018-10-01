import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { Screen } from "./screen"
import {
    testPlayerNavigated,
    testTeamNavigated,
    testPlayerNextNavigated,
    testTeamNextNavigated,
    testPlayersNavigated,
    testTeamsNavigated
} from "./shared.e2e-spec"

describe("tab-view:", () => {
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

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logScreenshot(this.currentTest.title);
        }
    });

    it("loaded home component and lists", async () => {
        await screen.navigateToHomePage();
        await screen.loadedHome();
        await screen.loadedPlayersList();
        await screen.loadedTeamList();
    });

    it("loaded tabs component, Players List and Teams List pages", async () => {
        await screen.navigateToTabsPage();
        await screen.loadedTabs();
        await screen.loadedPlayersList();
        await gotoTeamsTab(driver);
        await screen.loadedTeamList();
        await gotoPlayersTab(driver);
        await screen.loadedPlayersList();
    });

    it("should navigate Player One/Team One then back separately", async () => {
        await testPlayerNavigated(driver, screen, screen.playerOne);
        await gotoTeamsTab(driver);
        await testTeamNavigated(driver, screen, screen.teamOne);
        await backTeams(driver);
        await screen.loadedTeamList();
        await gotoPlayersTab(driver);
        await backPlayers(driver);
        await screen.loadedPlayersList();
    });

    it("should navigate Player One/Team One then next Player/Team then back", async () => {
        await testPlayerNavigated(driver, screen, screen.playerOne);
        await testPlayerNextNavigated(driver, screen, screen.playerTwo);
        await gotoTeamsTab(driver);
        await testTeamNavigated(driver, screen, screen.teamOne);
        await testTeamNextNavigated(driver, screen, screen.teamTwo);
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

    // it("should navigate Player One/Team One then back separately (keep order)", async () => {
    //     await testPlayerNavigated(driver, screen, screen.playerOne);
    //     await testTeamNavigated(driver, screen, screen.teamOne);
    //     await backTeams(driver);
    //     await screen.loadedTeamList();
    //     await backPlayers(driver);
    //     await screen.loadedPlayersList();
    // });

    // it("should navigate Player One/Team One then back simultaneously", async () => {
    //     await testPlayerNavigated(driver, screen, screen.playerOne);
    //     await testTeamNavigated(driver, screen, screen.teamOne);
    //     await backBoth(driver);
    //     await screen.loadedTeamList();
    //     await screen.loadedPlayersList();
    // });

    // it("should navigate Player One/Team One then next Player/Team then back separately", async () => {
    //     await testPlayerNavigated(driver, screen, screen.playerOne);
    //     await testTeamNavigated(driver, screen, screen.teamOne);
    //     await testPlayerNextNavigated(driver, screen, screen.playerTwo);
    //     await testTeamNextNavigated(driver, screen, screen.teamTwo);

    //     await backPlayers(driver);
    //     await screen.loadedPlayerDetails(screen.playerOne);
    //     await backTeams(driver);
    //     await screen.loadedTeamDetails(screen.teamOne);
    //     await backBoth(driver);
    //     await screen.loadedTeamList();
    //     await screen.loadedPlayersList();
    // });

    // it("should navigate Player One/Team One then back", async () => {
    //     await testPlayerNavigated(driver, screen, screen.playerOne);
    //     await testTeamNavigated(driver, screen, screen.teamOne);
    //     // await driver.navBack();
    //     await back(driver);
    //     await screen.loadedPlayerDetails(screen.playerOne);
    //     await screen.loadedTeamList();

    //     await backPlayers(driver);
    //     await screen.loadedPlayersList();
    // });

    // it("should navigate Player One then navigate Players list then back", async () => {
    //     await testPlayerNavigated(driver, screen, screen.playerOne);
    //     await testPlayerNextNavigated(driver, screen, screen.playerTwo);
    //     await testPlayersNavigated(driver, screen);
    //     await back(driver);
    //     await screen.loadedPlayerDetails(screen.playerTwo);
    //     await back(driver);
    //     await screen.loadedPlayerDetails(screen.playerOne);
    //     await back(driver);
    //     await screen.loadedPlayersList;
    // });

    // it("should navigate Player One/Team One then Android back button", async () => {
    //     if (driver.isAndroid) {
    //         await testPlayerNavigated(driver, screen, screen.playerOne);
    //         await testTeamNavigated(driver, screen, screen.teamOne);
    //         await driver.navBack();
    //         await screen.loadedPlayerDetails(screen.playerOne);
    //         await screen.loadedTeamList();

    //         await backPlayers(driver);
    //         await screen.loadedPlayersList();
    //     }
    // });

    // it("should navigate Player One then navigate Players list then Android back button", async function () {
    //     if (driver.isAndroid) {
    //         await testPlayerNavigated(driver, screen, screen.playerOne);
    //         await testPlayerNextNavigated(driver, screen, screen.playerTwo);
    //         await testPlayersNavigated(driver, screen);
    //         await driver.navBack();
    //         await screen.loadedPlayerDetails(screen.playerTwo);
    //         await driver.navBack();
    //         await screen.loadedPlayersList;
    //     }
    // });

    // it("should navigate back to Login page with back(activatedRoute)", async function () {
    //     await backActivatedRoute(driver);
    //     await screen.loadedLogin;
    // });
});

async function gotoPlayersTab(driver: AppiumDriver) {
    const btnTabPlayers = await driver.findElementByText("Players Tab");
    await btnTabPlayers.tap();
}

async function gotoTeamsTab(driver: AppiumDriver) {
    const btnTabTeams = await driver.findElementByText("Teams Tab");
    await btnTabTeams.tap();
}

async function backTeams(driver: AppiumDriver) {
    const btnBackTeams = await driver.findElementByText("Back(Teams)");
    await btnBackTeams.tap();
}

async function backPlayers(driver: AppiumDriver) {
    const btnBackPlayers = await driver.findElementByText("Back(Players)");
    await btnBackPlayers.tap();
}
