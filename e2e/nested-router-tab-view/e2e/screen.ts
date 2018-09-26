import { AppiumDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

const home = "Home Component";
const login = "Login Component";
const tabs = "Tabs Component";

const playerList = "Player List";
const playerDetails = "Player Details";
const gotoNextPlayer = "next player";
const gotoPlayers = "players";

const teamDetails = "Team Details";
const teamList = "Team List";
const gotoNextTeam = "next team";
const gotoTeams = "teams";

const gotoHomePage = "Go To Home Page";
const gotoTabsPage = "Go To Tabs Page";

export class Screen {

    private _driver: AppiumDriver

    playerOne = "Player One";
    playerTwo = "Player Two";
    teamOne = "Team One";
    teamTwo = "Team Two";

    constructor(driver: AppiumDriver) {
        this._driver = driver;
    }

    loadedLogin = async () => {
        const lblLogin = await this._driver.findElementByText(login);
        assert.isTrue(await lblLogin.isDisplayed());
        console.log(login + " loaded!");
    }

    loadedHome = async () => {
        const lblHome = await this._driver.findElementByText(home);
        assert.isTrue(await lblHome.isDisplayed());
        console.log(home + " loaded!");
    }

    loadedTabs = async () => {
        const lblTabs = await this._driver.findElementByText(tabs);
        assert.isTrue(await lblTabs.isDisplayed());
        console.log(tabs + " loaded!");
    }

    navigateToTabsPage = async () => {
        const btnNavToTabsPage = await this._driver.findElementByText(gotoTabsPage);
        await btnNavToTabsPage.tap();
    }

    loadedPlayersList = async () => {
        const lblPlayerList = await this._driver.findElementByText(playerList);
        assert.isTrue(await lblPlayerList.isDisplayed());
        console.log(playerList + " loaded!");
    }

    loadedPlayerDetails = async (player) => {
        const lblPlayerDetail = await this._driver.findElementByText(playerDetails);
        assert.isTrue(await lblPlayerDetail.isDisplayed());

        const lblPlayer = await this._driver.findElementByText(player + " Details");
        assert.isTrue(await lblPlayer.isDisplayed());

        console.log(player + " Details" + " loaded!");
    }

    loadedTeamList = async () => {
        const lblTeamList = await this._driver.findElementByText(teamList);
        assert.isTrue(await lblTeamList.isDisplayed());
        console.log(teamList + " loaded!");
    }

    loadedTeamDetails = async (team) => {
        const lblTeamDetail = await this._driver.findElementByText(teamDetails);
        assert.isTrue(await lblTeamDetail.isDisplayed());

        const lblTeam = await this._driver.findElementByText(team + " Details");
        assert.isTrue(await lblTeam.isDisplayed());

        console.log(team + " Details" + " loaded!");
    }

    navigateToHomePage = async () => {
        const btnNavToHomePage = await this._driver.findElementByText(gotoHomePage);
        await btnNavToHomePage.tap();
    }

    navigateToPlayer = async (player: string) => {
        const btnNavPlayerPage = await this._driver.findElementByText(player);
        await btnNavPlayerPage.tap();
    }

    navigateToNextPlayer = async () => {
        const btnNavPlayerNextPage = await this._driver.findElementByText(gotoNextPlayer);
        await btnNavPlayerNextPage.tap();
    }

    navigateToPlayers = async () => {
        const btnNavPlayersPage = await this._driver.findElementByText(gotoPlayers);
        await btnNavPlayersPage.tap();
    }

    navigateToTeam = async (team: string) => {
        const btnNavTeamPage = await this._driver.findElementByText(team);
        await btnNavTeamPage.tap();
    }

    navigateToNextTeam = async () => {
        const btnNavTeamNextPage = await this._driver.findElementByText(gotoNextTeam);
        await btnNavTeamNextPage.tap();
    }

    navigateToTeams = async () => {
        const btnNavTeamsPage = await this._driver.findElementByText(gotoTeams);
        await btnNavTeamsPage.tap();
    }
}