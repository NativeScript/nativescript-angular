import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/common/src/forms-deprecated/directives/control_value_accessor';
import {isBlank, isNumber} from '@angular/core/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor';
import {View} from "ui/core/view";
import * as utils from '../common/utils';

const SELECTED_INDEX_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => SelectedIndexValueAccessor), multi: true });

export type SelectableView = {selectedIndex: number} & View;

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
    selector: 'SegmentedBar[ngModel], ListPicker[ngModel], TabView[ngModel]',
    host: { '(selectedIndexChange)': 'onChange($event.value)' },
    providers: [SELECTED_INDEX_VALUE_ACCESSOR]
})
export class SelectedIndexValueAccessor extends BaseValueAccessor<SelectableView> {
    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }
    
    private _normalizedValue: number;
    private viewInitialized: boolean;

    writeValue(value: any): void {
        this._normalizedValue = utils.convertToInt(value);
        if (this.viewInitialized) {
            this.view.selectedIndex = this._normalizedValue;
        }
    }
    
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.view.selectedIndex = this._normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
