import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from "tns-core-modules/data/observable";
import { ActivatedRoute } from "@angular/router";
import { confirm } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
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
        //this.routerExtension.navigate(["players"], { relativeTo: this.activeRoute });
        this.routerExtension.navigate([{ outlets: { playerTab: ["players"], teamTab: ["teams"] } }], { relativeTo: this.activeRoute });
    }

    canGoBack() {
        const canGoBack = this.routerExtension.canGoBack({ relativeTo: this.activeRoute });
        const title = "CanGoBack(ActivatedRoute)";
        this.onShowDialog(title, title + ` ${canGoBack}`);
    }

    backActivatedRoute() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    back() {
        this.routerExtension.back();
    }

    onShowDialog(title: string, result: string) {
        let options: any = {
            title: title,
            message: result,
            okButtonText: "Ok"
        }

        confirm(options).then((result: boolean) => {
            console.log(result);
        })
    }
}
