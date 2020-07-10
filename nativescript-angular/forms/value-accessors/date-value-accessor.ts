import { Directive, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseValueAccessor } from './base-value-accessor';
import { DatePicker } from '@nativescript/core';

const DATE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DateValueAccessor),
	multi: true,
};

/**
 * The accessor for setting a date and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <DatePicker [(ngModel)]="model.test">
 *  ```
 */
@Directive({
	selector: 'DatePicker[ngModel],DatePicker[formControlName],DatePicker[formControl],' + 'datepicker[ngModel],datepicker[formControlName],datepicker[formControl],' + 'datePicker[ngModel],datePicker[formControlName],datePicker[formControl],' + 'date-picker[ngModel],date-picker[formControlName],date-picker[formControl]',
	providers: [DATE_VALUE_ACCESSOR],
	host: {
		'(dateChange)': 'onChange($event.value)',
	},
})
export class DateValueAccessor extends BaseValueAccessor<DatePicker> {
	// tslint:disable-line:directive-class-suffix
	constructor(elementRef: ElementRef) {
		super(elementRef.nativeElement);
	}

	writeValue(value: any): void {
		const normalized = super.normalizeValue(value);
		this.view.date = normalized;
	}
}
