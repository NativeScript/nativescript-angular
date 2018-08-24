import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from "tns-core-modules/data/observable";
import { ActivatedRoute } from "@angular/router";
import { confirm } from "ui/dialogs";
import { Page } from "ui/page";
import { AppModule } from "../app.module";

@Component({
    moduleId: module.id,
    selector: "tabs-page",
    templateUrl: "./tabs.component.html"
})
export class TabsComponent {
    constructor(
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        private page: Page) {
           // this.page.actionBarHidden = true;
         }

    ngOnInit() {
        //this.routerExtension.navigate(["first"], { relativeTo: this.activeRoute });
        this.routerExtension.navigate([{ outlets: { playerTab: ["players"], teamTab: ["teams"] } }], { relativeTo: this.activeRoute });
    }
}
