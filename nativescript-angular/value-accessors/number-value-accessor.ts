import { Directive, ElementRef, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { Slider } from "tns-core-modules/ui/slider";

const NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberValueAccessor),
    multi: true,
};

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
    selector:
        "Slider[ngModel],Slider[formControlName]," +
        "slider[ngModel],slider[formControlName]",
    providers: [NUMBER_VALUE_ACCESSOR],
    host: {
        "(touch)": "onTouched()",
        "(valueChange)": "onChange($event.value)",
    },
})
export class NumberValueAccessor extends BaseValueAccessor<Slider> { // tslint:disable-line:directive-class-suffix
    onChange = (_: any) => {};
    onTouched = () => {};

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        this.view.value = value;
    }

    registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
