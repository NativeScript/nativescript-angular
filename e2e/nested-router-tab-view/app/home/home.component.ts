import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "home-page",
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    constructor(
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private activeRoute: ActivatedRoute,
        private routerExtension: RouterExtensions) { }

    ngOnInit() {
        //this.routerExtension.navigate(["first"], { relativeTo: this.activeRoute });
        //this.routerExtension.navigate([{ outlets: { playerTab: ["players"], teamTab: ["teams"] } }], { relativeTo: this.activeRoute });

        //this.routerExtension.navigate(['players'], { relativeTo: this.activeRoute });
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
        this.routerExtension.navigate([{ outlets: { playerTab: ['player', '1'] } }], { relativeTo: this.activeRoute, animated:true, transition: {name:"flip", duration:2000, curve:"linear"} });
    }


    // navigateTeams() {
    //     this.routerExtension.navigate([{ outlets: { teamTab: ['team', '1'] } }], { relativeTo: this.activeRoute });
    // }
}
