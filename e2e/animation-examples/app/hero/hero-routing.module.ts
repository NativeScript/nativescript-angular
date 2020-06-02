import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { HeroTeamBuilderComponent } from './hero-team-builder.component';

export const routes: Routes = [
    { path: "", pathMatch: "full", component: HeroTeamBuilderComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class HeroRoutingModule { }

export const routedComponents = [
    HeroTeamBuilderComponent,
];
