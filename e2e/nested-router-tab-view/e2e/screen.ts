import { AppiumDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

const home = "Home Component";
const about = "About Component";
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
const gotoAboutPage = "Go To About Page";
const gotoTabsPage = "Go To Tabs Page";
const confirmDialog = "Ok";

export class Screen {

    private _driver: AppiumDriver;

    playerOne = "Player One";
    playerTwo = "Player Two";
    teamOne = "Team One";
    teamTwo = "Team Two";

    canGoBackActivatedRoute = "CanGoBack(ActivatedRoute)";
    canGoBackPlayers = "CanGoBack(Players)";
    canGoBackTeams = "CanGoBack(Teams)";
    canGoBackBoth = "CanGoBack(Both)";

    constructor(driver: AppiumDriver) {
        this._driver = driver;
    }

    showDialogConfirm = async (title) => {
        const btnShowDialogConfirm = await this._driver.findElementByAutomationText(title);
        await btnShowDialogConfirm.tap();
    }

    loadedConfirmDialog = async (dialogMessage) => {
        const lblDialogMessage = await this._driver.findElementByAutomationText(dialogMessage);
        assert.isTrue(await lblDialogMessage.isDisplayed());
        console.log(dialogMessage + " shown!");
    }

    closeDialog = async () => {
        const btnYesDialog = await this._driver.findElementByAutomationText(confirmDialog);
        await btnYesDialog.click();
    }

    loadedLogin = async () => {
        const lblLogin = await this._driver.findElementByAutomationText(login);
        assert.isTrue(await lblLogin.isDisplayed());
        console.log(login + " loaded!");
    }

    loadedHome = async () => {
        const lblHome = await this._driver.findElementByAutomationText(home);
        assert.isTrue(await lblHome.isDisplayed());
        console.log(home + " loaded!");
    }

    loadedAbout= async () => {
        const lblAbout = await this._driver.findElementByAutomationText(about);
        assert.isTrue(await lblAbout.isDisplayed());
        console.log(home + " loaded!");
    }

    loadedTabs = async () => {
        const lblTabs = await this._driver.findElementByAutomationText(tabs);
        assert.isTrue(await lblTabs.isDisplayed());
        console.log(tabs + " loaded!");
    }

    navigateToTabsPage = async () => {
        const btnNavToTabsPage = await this._driver.findElementByAutomationText(gotoTabsPage);
        await btnNavToTabsPage.tap();
    }

    loadedPlayersList = async () => {
        const lblPlayerList = await this._driver.findElementByAutomationText(playerList);
        assert.isTrue(await lblPlayerList.isDisplayed());
        console.log(playerList + " loaded!");
    }

    loadedPlayerDetails = async (player) => {
        const lblPlayerDetail = await this._driver.findElementByAutomationText(playerDetails);
        assert.isTrue(await lblPlayerDetail.isDisplayed());

        const lblPlayer = await this._driver.findElementByAutomationText(player + " Details");
        assert.isTrue(await lblPlayer.isDisplayed());

        console.log(player + " Details" + " loaded!");
    }

    loadedTeamList = async () => {
        const lblTeamList = await this._driver.findElementByAutomationText(teamList, 10);
        assert.isTrue(await lblTeamList.isDisplayed());
        console.log(teamList + " loaded!");
    }

    loadedTeamDetails = async (team) => {
        const lblTeamDetail = await this._driver.findElementByAutomationText(teamDetails);
        assert.isTrue(await lblTeamDetail.isDisplayed());

        const lblTeam = await this._driver.findElementByAutomationText(team + " Details");
        assert.isTrue(await lblTeam.isDisplayed());

        console.log(team + " Details" + " loaded!");
    }

    navigateToHomePage = async (homePageButton?) => {
        const btnNavToHomePage = await this._driver.findElementByAutomationText(homePageButton || gotoHomePage);
        await btnNavToHomePage.tap();
    }

    navigateToAboutPage = async () => {
        const btnNavToAboutPage = await this._driver.findElementByAutomationText(gotoAboutPage);
        await btnNavToAboutPage.tap();
    }

    navigateToPlayer = async (player: string) => {
        const btnNavPlayerPage = await this._driver.findElementByAutomationText(player);
        await btnNavPlayerPage.tap();
    }

    navigateToNextPlayer = async () => {
        const btnNavPlayerNextPage = await this._driver.findElementByAutomationText(gotoNextPlayer);
        await btnNavPlayerNextPage.tap();
    }

    navigateToPlayers = async () => {
        const btnNavPlayersPage = await this._driver.findElementByAutomationText(gotoPlayers);
        await btnNavPlayersPage.tap();
    }

    navigateToTeam = async (team: string) => {
        const btnNavTeamPage = await this._driver.findElementByAutomationText(team);
        await btnNavTeamPage.tap();
    }

    navigateToNextTeam = async () => {
        const btnNavTeamNextPage = await this._driver.findElementByAutomationText(gotoNextTeam);
        await btnNavTeamNextPage.tap();
    }

    navigateToTeams = async () => {
        const btnNavTeamsPage = await this._driver.findElementByAutomationText(gotoTeams);
        await btnNavTeamsPage.tap();
    }
}