import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { ViewContainerRefService } from "../shared/ViewContainerRefService";

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
    private routerExtension: RouterExtensions) { }
  
  onNavigateSecond() {
      this.routerExtension.navigate(["second"]);
  }

  onNavigateSecondWithOutlet() {
    this.routerExtension.navigate([ { outlets: { namedRouter:["second"] } }]);
  }
}
