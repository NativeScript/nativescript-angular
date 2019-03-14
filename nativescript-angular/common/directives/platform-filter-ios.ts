import { Component, Inject } from "@angular/core";
import { Device, platformNames } from "tns-core-modules/platform";
import { DEVICE } from "nativescript-angular/core";

@Component({
    selector: "ios",
    template: `<ng-content *ngIf="show"></ng-content>`,
})
export class IosFilterComponent {
    public show: boolean;
    constructor( @Inject(DEVICE) device: Device) {
        this.show = (device.os === platformNames.ios);
    }
}
