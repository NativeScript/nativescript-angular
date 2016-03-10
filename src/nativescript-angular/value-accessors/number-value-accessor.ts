import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/src/common/forms/directives/control_value_accessor';
import {isBlank, isNumber} from 'angular2/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';

const NUMBER_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => NumberValueAccessor), multi: true });

/**
 * The accessor for setting a value and listening to changes that is used by the
 * {@link NgModel}
 *
 *  ### Example
 *  ```
 *  <Slider [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'Slider[ngModel]',
    host: { '(valueChange)': 'onChange($event.value)' },
    bindings: [NUMBER_VALUE_ACCESSOR]
})
export class NumberValueAccessor extends BaseValueAccessor {
    onTouched = () => { };

    constructor(private _renderer: Renderer, private _elementRef: ElementRef) { 
        super();
    }

    writeValue(value: any): void {
        let normalizedValue;
        if (isBlank(value)) {
            normalizedValue = 0;
        }
        else {
            if (isNumber(value)) {
                normalizedValue = value;
            }
            else {
                let parsedValue = Number(value);
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
        this._elementRef.nativeElement.value = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}