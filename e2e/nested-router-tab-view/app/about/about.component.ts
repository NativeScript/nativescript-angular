import { Component } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "about-page",
    templateUrl: "./about.component.html"
})
export class AboutComponent {
    constructor(
        private activeRoute: ActivatedRoute,
        private routerExtension: RouterExtensions) { }

    ngOnInit() {
    }

    backActivatedRoute() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }
}
