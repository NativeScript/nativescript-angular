import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { Slider } from "tns-core-modules/ui/slider";

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
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "Slider[ngModel], Slider[formControlName], slider[ngModel], slider[formControlName], slider[ngModel], slider[formControlName]",
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
        this.view.value = value;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
