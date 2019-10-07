import { Component, ViewContainerRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
// import { NSLocationStrategy } from "@nativescript/angular";

import { ViewContainerRefService } from "./shared/ViewContainerRefService";
import { AppModule } from "./app.module";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { ModalViewComponent } from "./modal-shared/modal-view.component";

@Component({
  selector: "ns-tab",
  templateUrl: "tab.component.html",
})
export class TabComponent  {
    constructor(
    router: Router,
    // location: NSLocationStrategy,
    private _vcRef: ViewContainerRef,
    private _viewContainerRefService: ViewContainerRefService,
    private modal: ModalDialogService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        console.log("[ROUTER]: " + e.toString());
        // console.log(location.toString());
      }
    });

    this._viewContainerRefService.root = this._vcRef;
  }

  ngOnInit() {
    if (AppModule.root === "tab-modal") {
      console.log("Show modal page from tab root view!");
      this.onRootModalTap();
    }
  }

  onRootModalTap(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this._viewContainerRefService.root,
      context: {},
      fullscreen: true
    };

    this.modal.showModal(ModalViewComponent, options).then((result: string) => {
      console.log(result);
    });
  }
}
