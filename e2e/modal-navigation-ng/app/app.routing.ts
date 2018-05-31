import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes, ChildrenOutletContexts } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { SecondComponent } from "./second/second.component";
import { ModalSecondComponent } from "./modal-second/modal-second.component";
import { ModalComponent } from "./modal/modal.component";
import { NestedModalComponent } from "./modal-nested/modal-nested.component";
import { ModalRouterComponent } from "./modal/modal-router/modal-router.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "home", component: HomeComponent, children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            { path: "modal-second", component: ModalSecondComponent }
        ]
    },
    {
        path: "second", component: SecondComponent, children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            { path: "modal-second", component: ModalSecondComponent }
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }