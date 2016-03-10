import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/src/common/forms/directives/control_value_accessor';
import {isBlank, isNumber} from 'angular2/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';

const SELECTED_INDEX_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => SelectedIndexValueAccessor), multi: true });

/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'SegmentedBar[ngModel], ListPicker[ngModel]',
    host: { '(selectedIndexChange)': 'onChange($event.value)' },
    bindings: [SELECTED_INDEX_VALUE_ACCESSOR]
})
export class SelectedIndexValueAccessor extends BaseValueAccessor {
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
                let parsedValue = parseInt(value);
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
        this._elementRef.nativeElement.selectedIndex = Math.round(normalizedValue);
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}