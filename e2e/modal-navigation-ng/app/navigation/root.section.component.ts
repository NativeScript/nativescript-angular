import { Component } from "@angular/core";
import { AppModule } from "../app.module";

@Component({
  moduleId: module.id,
  selector: "root-section",
  templateUrl: "./root.section.component.html"
})
export class RootSectionComponent {
  constructor() { }

  onFrameRootViewReset(showModal) {
    AppModule.root = showModal ? "page-router-modal" : "page-router";
    AppModule.platformRef._livesync();
  }

  onNamedFrameRootViewReset(showModal) {
    AppModule.root = showModal ? "named-page-router-modal" : "named-page-router";
    AppModule.platformRef._livesync();
  }

  onTabRootViewReset(showModal) {
    AppModule.root = showModal ? "tab-modal" : "tab";
    AppModule.platformRef._livesync();
  }

  onLayoutRootViewReset(showModal) {
    AppModule.root = showModal ? "layout-modal" : "layout";
    AppModule.platformRef._livesync();
  }
}
