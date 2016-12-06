import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { isBlank, isNumber } from "../lang-facade";
import { BaseValueAccessor, generateValueAccessorSelector } from "./base-value-accessor";
import { Slider } from "ui/slider";

const NUMBER_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberValueAccessor), multi: true};

/**
 * The accessor for setting a value and listening to changes that is used by the
 * {@link NgModel}
 *
 *  ### Example
 *  ```
 *  <Slider [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector: generateValueAccessorSelector("Slider"),
    providers: [NUMBER_VALUE_ACCESSOR]
})
export class NumberValueAccessor extends BaseValueAccessor<Slider> { // tslint:disable-line:directive-class-suffix
    @HostListener("valueChange", ["$event"])
    valueChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        let normalizedValue;
        if (isBlank(value)) {
            normalizedValue = 0;
        } else {
            if (isNumber(value)) {
                normalizedValue = value;
            } else {
                let parsedValue = Number(value);
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
        this.view.value = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
