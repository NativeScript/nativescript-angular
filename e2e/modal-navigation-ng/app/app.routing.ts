import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { Routes, Router } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { SecondComponent } from "./second/second.component";
import { ModalSecondComponent } from "./modal-second/modal-second.component";
import { ModalComponent } from "./modal/modal.component";
import { NestedModalComponent } from "./modal-nested/modal-nested.component";
import { ModalViewContentComponent } from "./modal-shared/modal-view-content.component";
import { ModalSharedSecondComponent } from "./modal-shared/modal-shared-second.component";

import { AppModule } from "./app.module";

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

const namedOutletRoutes: Routes = [
    { path: "", redirectTo: "/(namedRouter:home)", pathMatch: "full" },
    {
        path: "home", component: HomeComponent, outlet: "namedRouter", children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            { path: "modal-second", component: ModalSecondComponent }
        ]
    },
    {
        path: "second", outlet: "namedRouter", component: SecondComponent, children: [
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
        path: "modal-shared-second-host", outlet: "namedRouter", component: ModalSharedSecondComponent
    }
];

const routesTab: Routes = [
    { path: "", redirectTo: "/home(secondOutlet:second)", pathMatch: "full" },
    {
        path: "home", component: HomeComponent, children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            {
                path: "modal-second", component: ModalSecondComponent
            }
        ]
    },
    {
        path: "second", component: SecondComponent, children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            {
                path: "modal-second", component: ModalSecondComponent
            }
        ]
    },
    {
        path: "second", outlet: "secondOutlet", component: SecondComponent, children: [
            {
                path: "modal", component: ModalComponent, children: [
                    { path: "nested-frame-modal", component: NestedModalComponent }]
            },
            {
                path: "modal-second", component: ModalSecondComponent
            }
        ]
    },
    {
        path: "modal-shared", component: ModalViewContentComponent, outlet: "modalOutlet"
    },
    {
        path: "modal-shared-second-host", component: ModalSharedSecondComponent
    }
];

const routesLayout: Routes = [
    {
        path: "modal", component: ModalComponent, children: [
            { path: "nested-frame-modal", component: NestedModalComponent }]
    },
    { path: "modal-second", component: ModalSecondComponent },
    {
        path: "modal-shared", component: ModalViewContentComponent, outlet: "modalOutlet"
    },
    {
        path: "modal-shared-second-host", component: ModalSharedSecondComponent
    }
]

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
    constructor(private router: Router) {
        if (AppModule.root === "page-router" ||  AppModule.root === "page-router-modal") {
            this.router.resetConfig(routes);
        } else if (AppModule.root === "layout" || AppModule.root === "layout-modal") {
            this.router.resetConfig(routesLayout);
        } else if (AppModule.root === "named-page-router" || AppModule.root === "named-page-router-modal") {
            this.router.resetConfig(namedOutletRoutes);
        } else if(AppModule.root === "tab" ||  AppModule.root === "tab-modal"){
            this.router.resetConfig(routesTab);
        }
    }
}