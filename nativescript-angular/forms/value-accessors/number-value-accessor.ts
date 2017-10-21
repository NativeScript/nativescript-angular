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
        "Slider[ngModel],Slider[formControlName],Slider[formControl]," +
        "slider[ngModel],slider[formControlName],slider[formControl]",
    providers: [NUMBER_VALUE_ACCESSOR],
    host: {
        "(valueChange)": "onChange($event.value)",
    },
})
export class NumberValueAccessor extends BaseValueAccessor<Slider> { // tslint:disable-line:directive-class-suffix
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        const normalized = super.normalizeValue(value);
        this.view.value = normalized;
    }
}
