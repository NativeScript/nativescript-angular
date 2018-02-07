import { Injectable } from "@angular/core";
import { Router, UrlTree, NavigationExtras } from "@angular/router";
import { NSLocationStrategy, NavigationOptions } from "./ns-location-strategy";
import { FrameService } from "../platform-providers";

export type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;

@Injectable()
export class RouterExtensions {

    constructor(
        public router: Router,
        public locationStrategy: NSLocationStrategy,
        public frameService: FrameService
    ) { }

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

    public canGoBack() {
        return this.locationStrategy.canGoBack();
    }

    public backToPreviousPage() {
        this.frameService.getFrame().goBack();
    }

    public canGoBackToPreviousPage(): boolean {
        return this.frameService.getFrame().canGoBack();
    }
}
