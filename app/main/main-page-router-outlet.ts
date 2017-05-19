import { Component } from "@angular/core";
import * as platform from "platform";

@Component({
    selector: "main",
    template: `
    <WrapLayout id='mainView' [orientation]="orientation">
        <Button *ngFor="let page of pages" [text]="page.data.title" [nsRouterLink]="page.path" color="red" height="40"></Button>  
    </WrapLayout>
    `,
})
export class MainComponent {
    private _pages = [];
    private _routes = require("../app.routes").routes
    private _orientation: string = "vertical";

    constructor() {
        let navigatableRoutes = this._routes.filter((item) => {
            return item.data && item.data.isNavigatable && item.path;
        });

        this._pages = navigatableRoutes;
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
    selector: 'navigation-main',
    template: `<page-router-outlet></page-router-outlet>`
})
export class NavigationMainPageRouter { }
