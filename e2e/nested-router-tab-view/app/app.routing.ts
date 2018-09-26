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
import { Home2Component } from "./home2/home2.component";

export const COMPONENTS = [LoginComponent,HomeComponent, Home2Component, TabsComponent, PlayerComponent, PlayerDetailComponent, TeamsComponent, TeamDetailComponent];

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    //{ path: "", component: LoginComponent },
    {
        path: "login", component: LoginComponent
    },
    {
        path: "home", component: HomeComponent, children: [
            // {
            //     path: "players", children: [
            //         { path: "", component: PlayerComponent, outlet: "playerTab" },
            //     ]
            // }, primary-playerTab[], prumary-teamTAb
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    },
    {
        path: "home2", component: Home2Component, children: [
            // {
            //     path: "players", children: [
            //         { path: "", component: PlayerComponent, outlet: "playerTab" },
            //     ]
            // }, primary-playerTab[], prumary-teamTAb
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    },
    {
        path: "tabs", component: TabsComponent, children: [
            // {
            //     path: "players", children: [
            //         { path: "", component: PlayerComponent, outlet: "playerTab" },
            //     ]
            // },
            { path: "players", component: PlayerComponent, outlet: "playerTab" },
            { path: "player/:id", component: PlayerDetailComponent, outlet: "playerTab" },

            { path: "teams", component: TeamsComponent, outlet: "teamTab" },
            { path: "team/:id", component: TeamDetailComponent, outlet: "teamTab" },
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
