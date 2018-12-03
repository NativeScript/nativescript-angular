import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler, NgModuleFactoryLoader } from "@angular/core";
// import { NativeScriptModule } from "nativescript-angular/nativescript.module";
// import { AppRoutingModule, COMPONENTS } from "./app.routing";
// import { AppComponent } from "./app.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { DataService } from "./data.service";

import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { AboutNestedComponent } from "./about/about-nested.component";
import { PlayerComponent } from "./player/players.component";
import { PlayerDetailComponent } from "./player/player-detail.component";
import { TeamsComponent } from "./team/teams.component";
import { TeamDetailComponent } from "./team/team-detail.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
    ],
    declarations: [
        HomeComponent,
        AboutComponent,
        AboutNestedComponent,
        PlayerComponent,
        PlayerDetailComponent,
        TeamsComponent,
        TeamDetailComponent
    ],
    exports: [
        HomeComponent,
        AboutComponent,
        AboutNestedComponent,
        PlayerComponent,
        PlayerDetailComponent,
        TeamsComponent,
        TeamDetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class SharedModule { }