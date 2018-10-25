import { Screen } from "./screen"

export async function canGoBack(screen: Screen, title: string, result: boolean) {
    await screen.showDialogConfirm(title);
    await screen.loadedConfirmDialog(title + ` ${result}`);
    await screen.closeDialog();
}

export async function testPlayerNavigated(screen: Screen, player: string) {
    await screen.navigateToPlayer(player);
    await screen.loadedPlayerDetails(player);
}

export async function testPlayerNextNavigated(screen: Screen, nextPlayer: string) {
    await screen.navigateToNextPlayer();
    await screen.loadedPlayerDetails(nextPlayer);
}

export async function testPlayersNavigated(screen: Screen) {
    await screen.navigateToPlayers();
    await screen.loadedPlayersList();
}

export async function testTeamNavigated(screen: Screen, team: string) {
    await screen.navigateToTeam(team);
    await screen.loadedTeamDetails(team);
}

export async function testTeamNextNavigated(screen: Screen, nextTeam: string) {
    await screen.navigateToNextTeam();
    await screen.loadedTeamDetails(nextTeam);
}

export async function testTeamsNavigated(screen: Screen) {
    await screen.navigateToTeams();
    await screen.loadedTeamList();
}
