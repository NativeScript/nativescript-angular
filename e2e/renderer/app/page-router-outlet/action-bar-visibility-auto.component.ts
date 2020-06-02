import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  template: `
    <ActionBar title="Action Bar Visibility Auto">
    </ActionBar>
    
    <GridLayout rows="200, *" backgroundColor="salmon">
        <GridLayout row="1">
            <page-router-outlet name="nested" actionBarVisibility="auto"></page-router-outlet>
        </GridLayout>
    </GridLayout>
  `
})
export class ActionBarVisibilityAutoComponent implements OnInit {
    constructor(
      private routerExtension: RouterExtensions,
      private activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
      this.routerExtension.navigate([{ outlets: { nested: ["nested"] } }], { relativeTo: this.activeRoute });
    }
}
