import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Route } from "@angular/router";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PlayerComponent } from "../player/players.component";
import { PlayerDetailComponent } from "../player/player-detail.component";
import { TeamsComponent } from "../team/teams.component";
import { TeamDetailComponent } from "../team/team-detail.component";
import { HomeLazyComponent } from "./home-lazy.component";
import { DataService } from "../data.service";
import { SharedModule } from "../shared.module";
// import { LazyComponentlessRouteComponent } from "./lazy-componentless-route.component";

const routes: Route[] = [
    {
        path: "home",
        component: HomeLazyComponent,
        children: [
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    },

    // {
    //     path: "nest",
    //     children: [
    //         {
    //             path: "more",
    //             component: LazyComponentlessRouteComponent
    //         }
    //     ]
    // }
];

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        HomeLazyComponent,
        // LazyComponentlessRouteComponent
    ],
    providers: [
        DataService
    ]
})
export class HomeLazyModule { }