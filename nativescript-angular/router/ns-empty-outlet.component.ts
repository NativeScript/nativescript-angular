import { Component } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
@Component({
    // tslint:disable-next-line:component-selector
    selector: "ns-empty-outlet",
    moduleId: module.id,
    template: "<page-router-outlet isEmptyOutlet='true'></page-router-outlet>"
})
export class NSEmptyOutletComponent {
    constructor(private page: Page) {
        if (this.page) {
            this.page.actionBarHidden = true;
        }
    }
}
