import { Injectable, ViewContainerRef } from "@angular/core";

@Injectable()
export class ViewContainerRefService {
    private _rootViewContainerRef: ViewContainerRef;

    get root():ViewContainerRef {
        return this._rootViewContainerRef;
    }

    set root(viewContainerRef: ViewContainerRef) {
        this._rootViewContainerRef = viewContainerRef;
    }
}
