import { Component } from "@angular/core";
import * as platform from "tns-core-modules/platform";

@Component({
    selector: "main",
    styles: [
        ".main-btn{" +
        "margin-right:5; margin-bottom:5;" +
        "padding-left:5; padding-right:5;" +
        "background-color:#28a745;color:white;" +
        "border-radius:5;}"],
    template: `
    <WrapLayout id='mainView' [orientation]="orientation">
        <Button class="main-btn"
             *ngFor="let page of pages"
            [text]="page.data.title"
            [nsRouterLink]="page.path" height="40">
        </Button>
    </WrapLayout>
    `,
})
export class MainComponent {
    private _pages = [];
    private _routes = require("../app.routes").routes;
    private _orientation: string = "vertical";

    constructor() {
        const navigatableRoutes = this._routes.filter((item) => {
            return item.data && item.data.isNavigatable && item.path;
        });

        const examples = navigatableRoutes.sort((a, b) => {
            if (a.data.title > b.data.title) {
                return 1;
            }

            if (a.data.title < b.data.title) {
                return -1;
            }

            return 0;
        });

        this._pages = examples;
        if (platform.isAndroid) {
            this._orientation = "horizontal";
        }
    }

    get pages() {
        return this._pages;
    }

    get orientation() {
        return this._orientation;
    }
}

@Component({
    selector: "navigation-main",
    template: `<page-router-outlet></page-router-outlet>`
})
export class NavigationMainPageRouterComponent { }
