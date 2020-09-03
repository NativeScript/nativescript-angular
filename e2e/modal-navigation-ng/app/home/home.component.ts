import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { EventData } from "@nativescript/core";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { ModalComponent } from "../modal/modal.component";
import { ModalViewComponent } from "../modal-shared/modal-view.component";
import { confirm } from "@nativescript/core/ui/dialogs";

import { AppModule } from "../app.module";

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
    private routerExtension: RouterExtensions) {

    }
  
  onNavigateSecond() {
      this.routerExtension.navigate(["second"]);
  }

  onNavigateSecondWithOutlet() {
    this.routerExtension.navigate([ { outlets: { namedRouter:["second"] } }]);
  }
}
