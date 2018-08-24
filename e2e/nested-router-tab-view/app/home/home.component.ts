import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { confirm } from "ui/dialogs";

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

    canGoBack() {
        const canGoBack = this.routerExtension.canGoBack({ relativeTo: this.activeRoute });
        const title = "CanGoBack(ActivatedRoute)";
        this.onShowDialog(title, title + ` ${canGoBack}`);
    }

    canGoBackPlayers() {
        const canGoBack = this.routerExtension.canGoBack({ outlets: ["playerTab"], relativeTo: this.activeRoute });
        const title = "CanGoBack(Players)";
        this.onShowDialog(title, title + ` ${canGoBack}`);
    }

    canGoBackTeams() {
        const canGoBack = this.routerExtension.canGoBack({ outlets: ["teamTab"], relativeTo: this.activeRoute });
        const title = "CanGoBack(Teams)";
        this.onShowDialog(title, title + ` ${canGoBack}`);
    }

    canGoBackBoth() {
        const canGoBack = this.routerExtension.canGoBack({ outlets: ["teamTab", "playerTab"], relativeTo: this.activeRoute });
        const title = "CanGoBack(Both)";
        this.onShowDialog(title, title + ` ${canGoBack}`);
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
        this.routerExtension.navigate([{ outlets: { playerTab: ['player', '1'] } }], { relativeTo: this.activeRoute, animated: true, transition: { name: "flip", duration: 2000, curve: "linear" } });
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
