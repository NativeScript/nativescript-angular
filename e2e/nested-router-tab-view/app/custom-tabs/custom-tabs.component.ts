import { Component, OnInit } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { RouterExtensions } from "@nativescript/angular/router";
import { ActivatedRoute } from "@angular/router";
import { confirm } from "@nativescript/core/ui/dialogs";
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  moduleId: module.id,
  selector: 'custom-tabs',
  templateUrl: './custom-tabs.component.html'
})
export class CustomTabsComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private routerExtension: RouterExtensions,
    private page: Page) { }

  ngOnInit() {
  }

  canGoBackParentRoute() {
    const canGoBackParentRoute = this.routerExtension.canGoBack({ relativeTo: this.activeRoute });
    const title = "CanGoBack(ParentRoute)";
    this.onShowDialog(title, title + ` ${canGoBackParentRoute}`);
  }

  onRootBack() {
    this.page.frame.goBack();
  }

  onShowDialog(title: string, result: string) {
    let options: any = {
      title: title,
      message: result,
      okButtonText: "Ok"
    }

    confirm(options).then((result: boolean) => {
      console.log(result);
    })
  }
}
