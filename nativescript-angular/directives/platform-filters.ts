import { Component, Inject } from '@angular/core';
import { isIOS, isAndroid } from '@nativescript/core';

@Component({
	selector: 'android',
	template: `<ng-content *ngIf="show"></ng-content>`,
})
export class AndroidFilterComponent {
	public show: boolean;
	constructor() {
		this.show = isAndroid;
	}
}

@Component({
	selector: 'ios',
	template: `<ng-content *ngIf="show"></ng-content>`,
})
export class IosFilterComponent {
	public show: boolean;
	constructor() {
		this.show = isIOS;
	}
}
