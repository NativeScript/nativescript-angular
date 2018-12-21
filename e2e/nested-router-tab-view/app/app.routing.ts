import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { PlayerComponent } from "./player/players.component";
import { PlayerDetailComponent } from "./player/player-detail.component";
import { TeamsComponent } from "./team/teams.component";
import { TeamDetailComponent } from "./team/team-detail.component";
import { LoginComponent } from "./login/login.component";
import { TabsComponent } from "./tabs/tabs.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { AboutNestedComponent } from "./about/about-nested.component";

import { ModalComponent } from "./modal/modal.component";
import { NestedModalComponent } from "./modal-nested/modal-nested.component";
import { ModalSecondComponent } from "./modal-second/modal-second.component";
import { ModalRouterComponent } from "./modal/modal-router/modal-router.component";

export const COMPONENTS = [LoginComponent, TabsComponent];
export const MODALCOMPONENTS = [ModalComponent, NestedModalComponent, ModalSecondComponent, ModalRouterComponent];

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    //{ path: "", component: LoginComponent },
    {
        path: "login", component: LoginComponent
    },
    {
        path: "home", component: HomeComponent, children: [
            {
                path: "players", component: PlayerComponent, outlet: "playerTab", children: [
                    {
                        path: "modal", outlet: "modalOutlet", component: ModalComponent, children: [
                            { path: "nested-frame-modal", component: NestedModalComponent }]
                    },
                    { path: "modal-second", outlet: "modalOutlet", component: ModalSecondComponent }
                ]
            },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },

        ]
    },
    {
        path: "home-lazy",
        loadChildren: "./home-lazy/home-lazy.module#HomeLazyModule",
    },
    {
        path: "tabs", component: TabsComponent, children: [
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    },
    {
        path: "about", component: AboutComponent, children: [
            { path: "about-nested", component: AboutNestedComponent },
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
