import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "nativescript-angular/router";

import { ActionBarDynamicItemsComponent } from "./action-bar/action-bar-dynamic-items.component";
import { ActionBarExtensionComponent } from "./action-bar/action-bar-extension.component";

import { ActionBarVisibilityAlwaysComponent } from "./page-router-outlet/action-bar-visibility-always.component";
import { ActionBarVisibilityAutoComponent } from "./page-router-outlet/action-bar-visibility-auto.component"
import { ActionBarVisibilityNeverComponent } from "./page-router-outlet/action-bar-visibility-never.component"
import { NestedPageComponent } from "./page-router-outlet/nested-page.component"

import { TabItemBindingComponent } from "./tab-view/tab-item-binding.component";

import { ListComponent } from "./list.component";
import { NgForComponent } from "./ngfor.component";
import { NgForOfComponent } from "./ngforof.component";
import { NgIfNoLayoutComponent } from "./ngif-no-layout.component";
import { NgIfInbetweenComponent } from "./ngif-inbetween.component";
import { NgIfElseComponent } from "./ngifelse.component";
import { NgIfThenElseComponent } from "./ngif-then-else.component";
import { NgIfSubsequent } from "./ngif-subsequent.component";
import { ContentViewComponent } from "./content-view.component";

export const routes = [
    {
        path: "",
        redirectTo: "/list",
        pathMatch: "full"
    },
    {
        path: "action-bar-visibility-always",
        component: ActionBarVisibilityAlwaysComponent,
        children: [{
            path: "nested",
            outlet: "nested",
            component: NestedPageComponent
        }]
    },
    {
        path: "action-bar-visibility-never",
        component: ActionBarVisibilityNeverComponent,
        children: [{
            path: "nested",
            outlet: "nested",
            component: NestedPageComponent
        }]
    },
    {
        path: "action-bar-visibility-auto",
        component: ActionBarVisibilityAutoComponent,
        children: [{
            path: "nested",
            outlet: "nested",
            component: NestedPageComponent
        }]
    },
    {
        path: "action-bar-visibility-never-lazy",
        component: ActionBarVisibilityNeverComponent,
        children: [{
            path: "nested",
            outlet: "nested",
            component: NSEmptyOutletComponent,
            loadChildren:"~/page-router-outlet/nested-lazy-page.module#NestedLazyPageModule"
        }]
    },
    {
        path: "action-bar-dynamic",
        component: ActionBarDynamicItemsComponent,
    },
    {
        path: "action-bar-extension",
        component: ActionBarExtensionComponent,
    },
    {
        path: "tab-item-binding",
        component: TabItemBindingComponent,
    },
    {
        path: "list",
        component: ListComponent,
    },
    {
        path: "ngfor",
        component: NgForComponent,
    },
    {
        path: "ngforof",
        component: NgForOfComponent,
    },
    {
        path: "ngif-no-layout",
        component: NgIfNoLayoutComponent,
    },
    {
        path: "ngif-inbetween",
        component: NgIfInbetweenComponent,
    },
    {
        path: "ngifelse",
        component: NgIfElseComponent,
    },
    {
        path: "ngif-then-else",
        component: NgIfThenElseComponent,
    },
    {
        path: "ngif-subsequent",
        component: NgIfSubsequent,
    },
    {
        path: "content-view",
        component: ContentViewComponent,
    },
];

export const navigatableComponents = [
    ActionBarDynamicItemsComponent,
    ActionBarExtensionComponent,

    ActionBarVisibilityAlwaysComponent,
    ActionBarVisibilityNeverComponent,
    ActionBarVisibilityAutoComponent,

    TabItemBindingComponent,

    ListComponent,
    NgForComponent,
    NgForOfComponent,
    NgIfNoLayoutComponent,
    NgIfInbetweenComponent,
    NgIfElseComponent,
    NgIfThenElseComponent,
    NgIfSubsequent,
    ContentViewComponent,
];

@NgModule({
    imports: [ NativeScriptRouterModule.forRoot(routes) ],
    exports: [ NativeScriptRouterModule ],
})
export class AppRoutingModule { }

