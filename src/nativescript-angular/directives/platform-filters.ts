import {Component} from 'angular2/core';
import {device, platformNames} from "platform";

@Component({
    selector: "android",
    template: `<ng-content *ngIf="show"></ng-content>`,
})
export class AndroidFilterComponent {
    public show: boolean = device.os === platformNames.android;
}

@Component({
    selector: "ios",
    template: `<ng-content *ngIf="show"></ng-content>`,
})
export class IosFilterComponent {
    public show: boolean = device.os === platformNames.ios;
}