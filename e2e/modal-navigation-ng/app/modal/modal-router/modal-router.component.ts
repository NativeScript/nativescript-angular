import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
    selector: "ns-router",
    templateUrl: "app.component.html",
})

export class ModalRouterComponent implements OnInit {
    private modalRoute: string;

    constructor(private params: ModalDialogParams, private routerExtension: RouterExtensions, private activeRoute: ActivatedRoute) {
        this.modalRoute = params.context.modalRoute;
    }

    ngOnInit() {
        this.routerExtension.navigate([this.modalRoute], { relativeTo: this.activeRoute });
    }
}
