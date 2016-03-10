import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/src/common/forms/directives/control_value_accessor';
import {isBlank, isDate} from 'angular2/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';

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
export class TimeValueAccessor extends BaseValueAccessor {
    onTouched = () => { };

    constructor(private _renderer: Renderer, private _elementRef: ElementRef) { 
        super();
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
        this._elementRef.nativeElement.time = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}