import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ModalView",
    moduleId: module.id,
    template:`
    <page-router-outlet name="modalOutlet"></page-router-outlet>
    `
})
export class ModalViewComponent implements OnInit {
    constructor(private _routerExtensions: RouterExtensions) {}

    ngOnInit(): void {
        this._routerExtensions.navigate([{ outlets: { modalOutlet: ["modal-shared"]}}]);
    }
}
