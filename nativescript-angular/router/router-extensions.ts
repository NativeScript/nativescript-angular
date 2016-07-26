import {Injectable} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {NavigationExtras} from "@angular/router/src/router";
import {NSLocationStrategy, NavigationOptions} from "./ns-location-strategy";
import {Frame} from "ui/frame";

export type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;

@Injectable()
export class RouterExtensions {

    constructor(public router: Router, public locationStrategy: NSLocationStrategy, public frame: Frame) { }

    public navigate(commands: any[], extras?: ExtendedNavigationExtras): Promise<boolean> {
        if (extras) {
            this.locationStrategy._setNavigationOptions(extras);
        }
        return this.router.navigate(commands, extras);
    }

    public navigateByUrl(url: string | UrlTree, options?: NavigationOptions): Promise<boolean> {
        if (options) {
            this.locationStrategy._setNavigationOptions(options);
        }
        return this.router.navigateByUrl(url);
    }

    public back() {
        this.locationStrategy.back();
    }

    public backToPreviousPage() {
        this.frame.goBack();
    }

    public canGoBackToPreviousPage() {
        this.frame.canGoBack();
    }
}