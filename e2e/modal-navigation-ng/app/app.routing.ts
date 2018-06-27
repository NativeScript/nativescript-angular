import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { SecondComponent } from "./second/second.component";
import { ModalSecondComponent } from "./modal-second/modal-second.component";
import { ModalComponent } from "./modal/modal.component";
import { NestedModalComponent } from "./modal-nested/modal-nested.component";
import { ModalViewContentComponent } from "./modal-shared/modal-view-content.component";
import { ModalSharedSecondComponent } from "./modal-shared/modal-shared-second.component";

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
    },
    {
        path: "modal-shared", component: ModalViewContentComponent, outlet: "modalOutlet"
    },
    {
        path: "modal-shared-second-host", component: ModalSharedSecondComponent
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }