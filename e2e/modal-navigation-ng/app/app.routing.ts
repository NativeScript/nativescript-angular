import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { ModalTest } from "./modal/modal-test";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },

    { path: "home", component: HomeComponent },

    { path: "modal", component: ModalTest , children: [
        { path: "items", component: ItemsComponent },
        { path: "item/:id", component: ItemDetailComponent },
    ] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }