import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular/router";
import { Routes } from "@angular/router";

import { PlayerComponent } from "./player/players.component";
import { PlayerDetailComponent } from "./player/player-detail.component";
import { TeamsComponent } from "./team/teams.component";
import { TeamDetailComponent } from "./team/team-detail.component";

export const COMPONENTS = [PlayerComponent, PlayerDetailComponent, TeamsComponent, TeamDetailComponent];

const routes: Routes = [
    { path: "", redirectTo: "/(playerTab:players//teamTab:teams)", pathMatch: "full" },
    
    { path: "players", component: PlayerComponent, outlet: "playerTab"  },
    { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab"  },

    { path: "teams", component: TeamsComponent, outlet: "teamTab" },
    { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
