import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes, ChildrenOutletContexts } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ModalComponent } from "./modal/modal.component";
import { ModalRouterComponent } from "./modal/modal-router/modal-router.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "home", component: HomeComponent, children: [{
            path: "modal", component: ModalRouterComponent, children: [
                { path: "", component: ModalComponent }
            ]
        }]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }