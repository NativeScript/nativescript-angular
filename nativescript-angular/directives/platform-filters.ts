import { Component, Inject } from '@angular/core';
import { IDevice, platformNames } from '@nativescript/core';
import { DEVICE } from '../platform-providers';

@Component({
	selector: 'android',
	template: `<ng-content *ngIf="show"></ng-content>`,
})
export class AndroidFilterComponent {
	public show: boolean;
	constructor(@Inject(DEVICE) device: IDevice) {
		this.show = device.os === platformNames.android;
	}
}

@Component({
	selector: 'ios',
	template: `<ng-content *ngIf="show"></ng-content>`,
})
export class IosFilterComponent {
	public show: boolean;
	constructor(@Inject(DEVICE) device: IDevice) {
		this.show = device.os === platformNames.ios;
	}
}
