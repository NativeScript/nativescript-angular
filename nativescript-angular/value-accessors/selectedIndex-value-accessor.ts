import { Directive, ElementRef, forwardRef, AfterViewInit, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { View } from "tns-core-modules/ui/core/view";
import { convertToInt } from "../common/utils";

const SELECTED_INDEX_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectedIndexValueAccessor), multi: true};

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
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "SegmentedBar[ngModel], SegmentedBar[formControlName], segmentedBar[ngModel], segmentedBar[formControlName], segmented-bar[ngModel], segmented-bar[formControlName], ListPicker[ngModel], ListPicker[formControlName], listPicker[ngModel], listPicker[formControlName], list-picker[ngModel], list-picker[formControlName], TabView[ngModel], TabView[formControlName], tabView[ngModel], tabView[formControlName], tab-view[ngModel], tab-view[formControlName]",
    providers: [SELECTED_INDEX_VALUE_ACCESSOR]
})
export class SelectedIndexValueAccessor extends BaseValueAccessor<SelectableView> implements AfterViewInit { // tslint:disable-line:max-line-length directive-class-suffix
    @HostListener("selectedIndexChange", ["$event"])
    selectedIndexChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    private _normalizedValue: number;
    private viewInitialized: boolean;

    writeValue(value: any): void {
        this._normalizedValue = convertToInt(value);
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
