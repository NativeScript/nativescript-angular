import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/common/src/forms/directives/control_value_accessor';
import {isBlank, isDate} from '@angular/core/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';
import {TimePicker} from "ui/time-picker";

const TIME_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => TimeValueAccessor), multi: true });

/**
 * The accessor for setting a time and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TimePicker [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'TimePicker[ngModel]',
    host: { '(timeChange)': 'onChange($event.value)' },
    bindings: [TIME_VALUE_ACCESSOR]
})
export class TimeValueAccessor extends BaseValueAccessor<TimePicker> {
    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        var normalizedValue = isBlank(value) ? new Date() : value;
        if (!isDate(normalizedValue)) {
            if (typeof normalizedValue === 'string' || typeof normalizedValue === 'number') {
                normalizedValue = new Date(normalizedValue);
            }
            if (!isDate(normalizedValue)) {
                normalizedValue = new Date();
            }
        }
        this.view.time = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
