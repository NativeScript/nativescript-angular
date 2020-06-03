import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { RouterExtensions } from "@nativescript/angular/router";
import { EventData } from "@nativescript/core/data/observable";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { ModalComponent } from "../modal/modal.component";
import { ModalViewComponent } from "../modal-shared/modal-view.component";
import { confirm } from "@nativescript/core/ui/dialogs";

import { AppModule } from "../app.module";
import { PageService } from "@nativescript/angular";

@Component({
  moduleId: module.id,
  selector: "home-page",
  templateUrl: "./home.component.html"
})
export class HomeComponent {
  constructor(
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    private viewContainerRefService: ViewContainerRefService,
    private pageService: PageService,
    private routerExtension: RouterExtensions) {
      this.pageService.inPage$.subscribe((inPage) => console.log("HomeComponent - inPage", inPage));
    }
  
  onNavigateSecond() {
      this.routerExtension.navigate(["second"]);
  }

  onNavigateSecondWithOutlet() {
    this.routerExtension.navigate([ { outlets: { namedRouter:["second"] } }]);
  }
}
