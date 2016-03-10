import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/src/common/forms/directives/control_value_accessor';
import {isBlank} from 'angular2/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';

const CHECKED_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => CheckedValueAccessor), multi: true });

/**
 * The accessor for setting a checked property and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <Switch [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'Switch[ngModel]',
    host: { '(checkedChange)': 'onChange($event.value)' },
    bindings: [CHECKED_VALUE_ACCESSOR]
})
export class CheckedValueAccessor extends BaseValueAccessor {
    onTouched = () => { };

    constructor(private _renderer: Renderer, private _elementRef: ElementRef) { 
        super();
    }

    writeValue(value: any): void {
        let normalizedValue = false;
        if (!isBlank(value)) {
            if (typeof value === 'string') {
                normalizedValue = value.toLowerCase() === 'true' ? true : false;
            }
            else {
                normalizedValue = !!value;
            }
        }
        this._elementRef.nativeElement.checked = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}