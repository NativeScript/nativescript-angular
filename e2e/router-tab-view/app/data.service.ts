import { Injectable } from "@angular/core";

export interface DataItem {
    id: number;
    name: string;
}

@Injectable()
export class DataService {
    private players = new Array<DataItem>(
        { id: 1, name: "Player One" },
        { id: 2, name: "Player Two" },
        { id: 3, name: "Player Three" },
    );

    private teams = new Array<DataItem>(
        { id: 1, name: "Team One" },
        { id: 2, name: "Team Two" },
        { id: 3, name: "Team Three" },
    );

    getPlayers(): DataItem[] {
        return this.players;
    }

    getPlayer(id: number): DataItem {
        return this.players.filter(item => item.id === id)[0];
    }

    getTeams(): DataItem[] {
        return this.teams;
    }

    getTeam(id: number): DataItem {
        return this.teams.filter(item => item.id === id)[0];
    }
}
