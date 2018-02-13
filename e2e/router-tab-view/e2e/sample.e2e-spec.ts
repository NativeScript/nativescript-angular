import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

describe("sample scenario", () => {
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

    it("should find an tabs by text", async () => {
        await driver.findElementByText("Players", SearchOptions.exact);
        await driver.findElementByText("Teams", SearchOptions.exact);
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should be able to switch between tabs", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        const teamsTab = await driver.findElementByText("Teams", SearchOptions.exact);
        await teamsTab.click();
        await driver.findElementByText("Team List", SearchOptions.exact);

        const playerTab = await driver.findElementByText("Players", SearchOptions.exact);
        await playerTab.click();
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should go froward and go back on first tab", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        let player = await driver.findElementByText("Player One", SearchOptions.exact);
        await player.click();
        
        await driver.findElementByText("Player Details", SearchOptions.exact);
        await driver.findElementByText("1", SearchOptions.exact);
        await driver.findElementByText("Player One", SearchOptions.exact);

        await driver.navBack();
        await driver.findElementByText("Player List", SearchOptions.exact);
    });

    it("should go froward and go back on second tab", async () => {
        await driver.findElementByText("Player List", SearchOptions.exact);

        const teamsTab = await driver.findElementByText("Teams", SearchOptions.exact);
        await teamsTab.click();
        await driver.findElementByText("Team List", SearchOptions.exact);

        const team = await driver.findElementByText("Team Two", SearchOptions.exact);
        await team.click();
        
        await driver.findElementByText("Team Details", SearchOptions.exact);
        await driver.findElementByText("2", SearchOptions.exact);
        await driver.findElementByText("Team Two", SearchOptions.exact);

        await driver.navBack();
        await driver.findElementByText("Team List", SearchOptions.exact);
    });
});

async function selectTeamTab(driver: AppiumDriver, text: string) {
    const teamsTab = await driver.findElementByText("Teams", SearchOptions.exact);
    await teamsTab.click();
    await driver.findElementByText("Team List", SearchOptions.exact);
}

async function selectPlayerTab(driver: AppiumDriver, text: string) {
    const playerTab = await driver.findElementByText("Players", SearchOptions.exact);
    await playerTab.click();
    await driver.findElementByText("Player List", SearchOptions.exact);
}
