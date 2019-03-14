import { Component, Inject } from "@angular/core";
import { Device, platformNames } from "tns-core-modules/platform";
import { DEVICE } from "nativescript-angular/core";

@Component({
    selector: "android",
    template: `<ng-content *ngIf="show"></ng-content>`,
})
export class AndroidFilterComponent {
    public show: boolean;
    constructor( @Inject(DEVICE) device: Device) {
        this.show = (device.os === platformNames.android);
    }
}
