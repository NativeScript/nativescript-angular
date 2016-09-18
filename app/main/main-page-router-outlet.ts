import { Component } from "@angular/core";
import { routes } from "../app.routes";
import * as platform from "platform";

@Component({
    selector: "main",
    template: `
    <WrapLayout id='mainView' [orientation]="orientation">
        <Button *ngFor="let route of routers" [text]="route.data.title" [nsRouterLink]="route.path" [color]="route.data.isNavigatable == true ? 'red':'blue'" height="40"></Button>  
    </WrapLayout>
    `,
})
export class MainComponent {
    private _routers = [];
    private _routes = require("../app.routes").routes
    private _orientation: string = "vertical";

    constructor() {
        let routs = this._routes.filter((item) => {
            let isNavigatable = item.data.isNavigatable != undefined && item.data.isNavigatable == true && item.path != '';
            console.log("Page route:" + item.path + "; page name: " + item.data.title + "; isNavigatable: " + isNavigatable);
            return isNavigatable;
        });

        this._routers = routs;
        if (platform.isAndroid) {
            this._orientation = "horizontal";
        }
    }

    get routers() {
        return this._routers;
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
