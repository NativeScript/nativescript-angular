import { Directive, ElementRef, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseValueAccessor } from './base-value-accessor';
import { View } from '@nativescript/core/ui/core/view';

const SELECTED_INDEX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectedIndexValueAccessor),
    multi: true,
};

export type SelectableView = {selectedIndex: number} & View;

/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector:
        'SegmentedBar[ngModel],SegmentedBar[formControlName],SegmentedBar[formControl],' +
        'segmentedBar[ngModel],segmentedBar[formControlName],segmentedBar[formControl],' +
        'segmentedbar[ngModel],segmentedbar[formControlName],segmentedbar[formControl],' +
        'segmented-bar[ngModel],segmented-bar[formControlName],segmented-bar[formControl],' +

        'ListPicker[ngModel],ListPicker[formControlName],ListPicker[formControl],' +
        'listPicker[ngModel],listPicker[formControlName],listPicker[formControl],' +
        'listpicker[ngModel],listpicker[formControlName],listpicker[formControl],' +
        'list-picker[ngModel],list-picker[formControlName],list-picker[formControl],' +

        'TabView[ngModel],TabView[formControlName],TabView[formControl],' +
        'tabView[ngModel],tabView[formControlName],tabView[formControl],' +
        'tabview[ngModel],tabview[formControlName],tabview[formControl],' +
        'tab-view[ngModel],tab-view[formControlName],tab-view[formControl]',
    providers: [SELECTED_INDEX_VALUE_ACCESSOR],
    host: {
        '(selectedIndexChange)': 'onChange($event.value)',
    },
})
export class SelectedIndexValueAccessor extends BaseValueAccessor<SelectableView> implements AfterViewInit { // tslint:disable-line:max-line-length directive-class-suffix
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    private value: number;
    private viewInitialized: boolean;

    writeValue(value: any): void {
        const normalized = super.normalizeValue(value);
        this.value = normalized;

        if (this.viewInitialized) {
            this.view.selectedIndex = this.value;
        }
    }

    ngAfterViewInit() {
        this.viewInitialized = true;
        this.view.selectedIndex = this.value;
    }
}
