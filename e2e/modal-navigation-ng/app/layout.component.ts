import { Component, ViewContainerRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { NSLocationStrategy } from "@nativescript/angular/router";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { ModalViewComponent } from "./modal-shared/modal-view.component";
import { ViewContainerRefService } from "./shared/ViewContainerRefService";
import { AppModule } from "./app.module";

@Component({
    selector: "ns-layout",
    templateUrl: "layout.component.html",
})

export class LayoutComponent {
    constructor(
        private modal: ModalDialogService,
        private router: Router,
        private location: NSLocationStrategy,
        private vcRef: ViewContainerRef,
        private viewContainerRefService: ViewContainerRefService) {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                console.log("[ROUTER]: " + e.toString());
                console.log(this.location.toString());
            }
        });

        this.viewContainerRefService.root = this.vcRef;
    }

    ngOnInit() {
        if (AppModule.root === "layout-modal") {
            console.log("Show modal page from tab root view!");
            this.onRootModalTap();
        }
    }

    onRootModalTap(): void {
    const options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRefService.root,
        context: {},
        fullscreen: true
    };

    this.modal.showModal(ModalViewComponent, options).then((result: string) => {
        console.log(result);
    });
    } 
}
