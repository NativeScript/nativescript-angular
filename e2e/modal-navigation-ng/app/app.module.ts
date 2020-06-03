import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { NamedRouterComponent } from "./named-router.component";
import { TabComponent } from "./tab.component";
import { LayoutComponent } from "./layout.component";

import { HomeComponent } from "./home/home.component";
import { RootSectionComponent } from "./navigation/root.section.component";
import { BasicsNavigationComponent } from "./navigation/basic.navigation.component";
import { SecondComponent } from "./second/second.component";
import { ModalSecondComponent } from "./modal-second/modal-second.component";
import { ModalComponent } from "./modal/modal.component";
import { NestedModalComponent } from "./modal-nested/modal-nested.component";
import { ModalRouterComponent } from "./modal/modal-router/modal-router.component";
import { ModalViewComponent } from "./modal-shared/modal-view.component";
import { ModalViewContentComponent } from "./modal-shared/modal-view-content.component";
import { ModalSharedSecondComponent } from "./modal-shared/modal-shared-second.component";
import { ViewContainerRefService } from "./shared/ViewContainerRefService";

import { enable as traceEnable, addCategories } from "@nativescript/core/trace";
import { routerTraceCategory } from "@nativescript/angular/trace";
import { NativeScriptPlatformRef } from "@nativescript/angular";

addCategories(routerTraceCategory);
traceEnable();

@NgModule({
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    entryComponents: [
        AppComponent,
        NamedRouterComponent,
        TabComponent,
        LayoutComponent,
        ModalRouterComponent,
        NestedModalComponent,
        ModalComponent,
        ModalViewComponent
    ],
    declarations: [
        AppComponent,
        NamedRouterComponent,
        TabComponent,
        LayoutComponent,
        RootSectionComponent,
        BasicsNavigationComponent,
        HomeComponent,
        SecondComponent,
        ModalComponent,
        NestedModalComponent,
        ModalRouterComponent,
        ModalSecondComponent,
        ModalViewComponent,
        ModalViewContentComponent,
        ModalSharedSecondComponent
    ],
    providers: [
        ViewContainerRefService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/

export class AppModule {
    private static appRef: any;
    public static platformRef: NativeScriptPlatformRef;
    public static root: string = "page-router";

    ngDoBootstrap(app) {
        AppModule.appRef = app;
        AppModule.bootstrapRootComponent();
    }

    static bootstrapRootComponent() {
        const options = {
            'page-router': AppComponent,
            'page-router-modal': AppComponent,
            'named-page-router': NamedRouterComponent,
            'named-page-router-modal': NamedRouterComponent,
            'tab': TabComponent,
            'tab-modal': TabComponent,
            'layout': LayoutComponent,
            'layout-modal': LayoutComponent,
        };

        const component = options[AppModule.root];
        AppModule.appRef.bootstrap(component);
    }
}