import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "home-lazy-page",
    templateUrl: "./home-lazy.component.html"
})
export class HomeLazyComponent {
    constructor(
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private activeRoute: ActivatedRoute,
        private routerExtension: RouterExtensions) { }

    ngOnInit() {
        this.routerExtension.navigate([{ outlets: { playerTab: ["players"], teamTab: ["teams"] } }], { relativeTo: this.activeRoute });
    }

    backPlayers() {
        this.routerExtension.back({ outlets: ["playerTab"], relativeTo: this.activeRoute });
    }

    backTeams() {
        this.routerExtension.back({ outlets: ["teamTab"], relativeTo: this.activeRoute });
    }

    backBoth() {
        this.routerExtension.back({ outlets: ["teamTab", "playerTab"], relativeTo: this.activeRoute });
    }

    backActivatedRoute() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    back() {
        this.routerExtension.back();
    }

    navigatePlayers() {
        this.routerExtension.navigate([{ outlets: { playerTab: ['player', '1'] } }], { relativeTo: this.activeRoute });
    }


    navigateTeams() {
        this.routerExtension.navigate([{ outlets: { teamTab: ['team', '1'] } }], { relativeTo: this.activeRoute });
    }
}
