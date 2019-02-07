import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { CustomTabsComponent } from './custom-tabs.component';
import { PlayerComponent } from "../player/players.component";
import { PlayerDetailComponent } from "../player/player-detail.component";
import { TeamsComponent } from "../team/teams.component";
import { TeamDetailComponent } from "../team/team-detail.component";
import { Route } from "@angular/router";
import { SharedModule } from "../shared.module";

const routes: Route[] = [
  {
    path: 'tabs',
    component: CustomTabsComponent,
    children: [
      { path: "players", component: PlayerComponent },
      { path: "player/:id", component: PlayerDetailComponent },

      { path: "teams", component: TeamsComponent },
      { path: "team/:id", component: TeamDetailComponent },
    ]
  },
];

@NgModule({
  declarations: [CustomTabsComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild(routes),
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CustomTabsModule { }
