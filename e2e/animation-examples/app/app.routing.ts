import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { AnimationsListComponent } from "./animations-list.component";
import { AnimationBuilderComponent } from "./animation-builder.component";
import { ExternalAnimationComponent } from "./external-animation.component";
import { FadeInOutComponent } from "./fade-in-out.component";
import { OptionsComponent } from "./options.component";
import { OptionsDefaultComponent } from "./options-default.component";
import { AnimateChildComponent } from "./animate-child.component";
import { SelectorAllComponent } from "./selector-all.component";
import { QueryStaggerComponent } from "./query-stagger.component";

const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "list" },
    { path: "list", component: AnimationsListComponent },
    { path: "builder", component: AnimationBuilderComponent },
    { path: "external", component: ExternalAnimationComponent },
    { path: "fade-in-out", component: FadeInOutComponent },
    { path: "options", component: OptionsComponent },
    { path: "options-default", component: OptionsDefaultComponent },
    { path: "animate-child", component: AnimateChildComponent },
    { path: "selector", component: SelectorAllComponent },
    { path: "query-stagger", component: QueryStaggerComponent },
    { path: "hero", loadChildren: () => import("./hero/hero.module").then(m => m.HeroModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
