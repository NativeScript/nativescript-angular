import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

describe("TabView with page-router-outlet in each tab", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find any tabs by text", async () => {
        await driver.findElementByAutomationText("Players");
        await driver.findElementByAutomationText("Teams");
        await driver.findElementByAutomationText("Player List");
    });

    it("should be able to switch between tabs", async () => {
        await driver.findElementByAutomationText("Player List");

        await selectTeamTab(driver);

        await selectPlayerTab(driver);
    });

    it("should go forward and go back on first(player) tab", async () => {
        await driver.findElementByAutomationText("Player List");

        await navigateToPlayerItem(driver, "Player One", "1");

        await driver.navBack();
        await driver.findElementByAutomationText("Player List");
    });

    it("should go forward and go back on second(team) tab", async () => {
        await driver.findElementByAutomationText("Player List");

        await selectTeamTab(driver);

        await navigateToTeamItem(driver, "Team Two", "2");

        await driver.navBack();
        await driver.findElementByAutomationText("Team List");

        await selectPlayerTab(driver);
    });

    it("should navigate first(player) tab, second(team) tab and back in the same order ", async () => {
        await driver.findElementByAutomationText("Player List");

        // Go forward in player tab
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Check both tabs
        await selectPlayerTab(driver, false);
        await selectTeamTab(driver, false);

        // Go back in team tab
        await driver.navBack();
        await driver.findElementByAutomationText("Team List");

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.navBack();
        await driver.findElementByAutomationText("Player List");
    });

    it("should navigate second(team) tab, first(player) and back in the same order ", async () => {
        await driver.findElementByAutomationText("Player List");

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Go forward in player tab
        await selectPlayerTab(driver);
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Check both tabs
        await selectTeamTab(driver, false);
        await selectPlayerTab(driver, false);

        // Go back in player tab
        await driver.navBack();
        await driver.findElementByAutomationText("Player List");

        // Go back in team tab
        await selectTeamTab(driver, false);
        await driver.navBack();
        await driver.findElementByAutomationText("Team List");

        await selectPlayerTab(driver);
    });

    it("should navigate first(player) tab, second(team) tab and back in reverse order ", async () => {
        await driver.findElementByAutomationText("Player List");

        // Go forward in player tab
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.navBack();
        await driver.findElementByAutomationText("Player List");

        // Go back in player tab
        await selectTeamTab(driver, false);
        await driver.findElementByAutomationText("1");
        await driver.findElementByAutomationText("Team One");

        await driver.navBack();
        await driver.findElementByAutomationText("Team List");

        await selectPlayerTab(driver);        
    });

    it("should navigate second(team) tab, first(player) tab and back in reverse order ", async () => {
        await driver.findElementByAutomationText("Player List");

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Go forward in player tab
        await selectPlayerTab(driver);
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Go back in team tab
        await selectTeamTab(driver, false);
        await driver.navBack();
        await driver.findElementByAutomationText("Team List");

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.findElementByAutomationText("3");
        await driver.findElementByAutomationText("Player Three");

        await driver.navBack();
        await driver.findElementByAutomationText("Player List");
    });

});

async function navigateToTeamItem(driver: AppiumDriver, name: string, id: string) {
    const team = await driver.findElementByAutomationText(name);
    await team.click();
    await driver.findElementByAutomationText("Team Details");
    await driver.findElementByAutomationText(id);
    await driver.findElementByAutomationText(name);
}

async function navigateToPlayerItem(driver: AppiumDriver, name: string, id: string) {
    let player = await driver.findElementByAutomationText(name);
    await player.click();

    await driver.findElementByAutomationText("Player Details");
    await driver.findElementByAutomationText(id);
    await driver.findElementByAutomationText(name);
}

async function selectTeamTab(driver: AppiumDriver, expectList = true) {
    const teamsTab = await driver.findElementByAutomationText("Teams");
    await teamsTab.click();

    const expectedTitle = expectList ? "Team List" : "Team Details";
    await driver.findElementByAutomationText(expectedTitle);
}

async function selectPlayerTab(driver: AppiumDriver, expectList = true) {
    const playerTab = await driver.findElementByAutomationText("Players");
    await playerTab.click();

    const expectedTitle = expectList ? "Player List" : "Player Details";
    await driver.findElementByAutomationText(expectedTitle);
}
