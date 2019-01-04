import { Component, ViewChild } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { PageRouterOutlet } from "./page-router-outlet";
@Component({
    // tslint:disable-next-line:component-selector
    selector: "ns-empty-outlet",
    template: "<page-router-outlet isEmptyOutlet='true'></page-router-outlet>"
})
export class NSEmptyOutletComponent {
    @ViewChild(PageRouterOutlet) pageRouterOutlet: PageRouterOutlet;
    constructor(private page: Page) {
        if (this.page) {
            this.page.actionBarHidden = true;

            this.page.on("loaded", () => {
                if (this.pageRouterOutlet && this.page.frame) {
                    this.pageRouterOutlet.setActionBarVisibility(this.page.frame.actionBarVisibility);
                }
            });
        }
    }
}
