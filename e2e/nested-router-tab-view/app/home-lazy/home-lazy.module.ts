import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Route } from "@angular/router";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PlayerComponent } from "../player/players.component";
import { PlayerDetailComponent } from "../player/player-detail.component";
import { TeamsComponent } from "../team/teams.component";
import { TeamDetailComponent } from "../team/team-detail.component";
import { HomeComponent } from "../home/home.component";
import { DataService } from "../data.service";
import { SharedModule } from "../shared.module";

const routes: Route[] = [
    {
        path: "home",
        component: HomeComponent,
        children: [
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    }
];

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    providers: [
        DataService
    ]
})
export class HomeLazyModule { }