import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { RouterExtensions } from "@nativescript/angular/router";
import { EventData } from "@nativescript/core/data/observable";
import { confirm } from "@nativescript/core/ui/dialogs";

import { AppModule } from "../app.module";

@Component({
    moduleId: module.id,
    selector: "login-page",
    templateUrl: "./login.component.html"
})
export class LoginComponent {
    constructor(
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private routerExtension: RouterExtensions) { }
}
