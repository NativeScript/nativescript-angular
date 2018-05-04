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
            await driver.logScreenshot(this.currentTest.title);
        }
    });

    it("should find any tabs by text", async () => {
        await driver.findElementByText("Players", SearchOptions.exact);
        await driver.findElementByText("Teams", SearchOptions.exact);
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should be able to switch between tabs", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        await selectTeamTab(driver);

        await selectPlayerTab(driver);
    });

    it("should go forward and go back on first(player) tab", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        await navigateToPlayerItem(driver, "Player One", "1");

        await driver.navBack();
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should go forward and go back on second(team) tab", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        await selectTeamTab(driver);

        await navigateToTeamItem(driver, "Team Two", "2");

        await driver.navBack();
        await driver.findElementByText("Team List", SearchOptions.exact);

        await selectPlayerTab(driver);
    });

    it("should navigate first(player) tab, second(team) tab and back in the same order ", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

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
        await driver.findElementByText("Team List", SearchOptions.exact);

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.navBack();
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should navigate second(team) tab, first(player) and back in the same order ", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

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
        await driver.findElementByText("Player List", SearchOptions.exact);

        // Go back in team tab
        await selectTeamTab(driver, false);
        await driver.navBack();
        await driver.findElementByText("Team List", SearchOptions.exact);

        await selectPlayerTab(driver);
    });

    it("should navigate first(player) tab, second(team) tab and back in reverse order ", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        // Go forward in player tab
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.navBack();
        await driver.findElementByText("Player List", SearchOptions.exact);

        // Go back in player tab
        await selectTeamTab(driver, false);
        await driver.findElementByText("1", SearchOptions.exact);
        await driver.findElementByText("Team One", SearchOptions.exact);

        await driver.navBack();
        await driver.findElementByText("Team List", SearchOptions.exact);

        await selectPlayerTab(driver);        
    });

    it("should navigate second(team) tab, first(player) tab and back in reverse order ", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        // Go forward in team tab
        await selectTeamTab(driver);
        await navigateToTeamItem(driver, "Team One", "1");

        // Go forward in player tab
        await selectPlayerTab(driver);
        await navigateToPlayerItem(driver, "Player Three", "3");

        // Go back in team tab
        await selectTeamTab(driver, false);
        await driver.navBack();
        await driver.findElementByText("Team List", SearchOptions.exact);

        // Go back in player tab
        await selectPlayerTab(driver, false);
        await driver.findElementByText("3", SearchOptions.exact);
        await driver.findElementByText("Player Three", SearchOptions.exact);

        await driver.navBack();
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

});

async function navigateToTeamItem(driver: AppiumDriver, name: string, id: string) {
    const team = await driver.findElementByText(name, SearchOptions.exact);
    await team.click();
    await driver.findElementByText("Team Details", SearchOptions.exact);
    await driver.findElementByText(id, SearchOptions.exact);
    await driver.findElementByText(name, SearchOptions.exact);
}

async function navigateToPlayerItem(driver: AppiumDriver, name: string, id: string) {
    let player = await driver.findElementByText(name, SearchOptions.exact);
    await player.click();

    await driver.findElementByText("Player Details", SearchOptions.exact);
    await driver.findElementByText(id, SearchOptions.exact);
    await driver.findElementByText(name, SearchOptions.exact);
}

async function selectTeamTab(driver: AppiumDriver, expectList = true) {
    const teamsTab = await driver.findElementByText("Teams", SearchOptions.exact);
    await teamsTab.click();

    const expectedTitle = expectList ? "Team List" : "Team Details";
    await driver.findElementByText(expectedTitle, SearchOptions.exact);
}

async function selectPlayerTab(driver: AppiumDriver, expectList = true) {
    const playerTab = await driver.findElementByText("Players", SearchOptions.exact);
    await playerTab.click();

    const expectedTitle = expectList ? "Player List" : "Player Details";
    await driver.findElementByText(expectedTitle, SearchOptions.exact);
}
