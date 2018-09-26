import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { Screen } from "./screen"

export async function testPlayerNavigated(driver: AppiumDriver, screen: Screen, player: string) {
    await screen.navigateToPlayer(player);
    await screen.loadedPlayerDetails(player);
}

export async function testPlayerNextNavigated(driver: AppiumDriver, screen: Screen, nextPlayer: string) {
    await screen.navigateToNextPlayer();
    await screen.loadedPlayerDetails(nextPlayer);
}

export async function testPlayersNavigated(driver: AppiumDriver, screen: Screen) {
    await screen.navigateToPlayers();
    await screen.loadedPlayersList();
}

export async function testTeamNavigated(driver: AppiumDriver, screen: Screen, team: string) {
    await screen.navigateToTeam(team);
    await screen.loadedTeamDetails(team);
}

export async function testTeamNextNavigated(driver: AppiumDriver, screen: Screen, nextTeam: string) {
    await screen.navigateToNextTeam();
    await screen.loadedTeamDetails(nextTeam);
}

export async function testTeamsNavigated(driver: AppiumDriver, screen: Screen) {
    await screen.navigateToTeams();
    await screen.loadedTeamList();
}