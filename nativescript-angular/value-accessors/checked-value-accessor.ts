import { Directive, ElementRef, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { Switch } from "tns-core-modules/ui/switch";

const CHECKED_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckedValueAccessor),
    multi: true,
};

/**
 * The accessor for setting a checked property and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <Switch [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector:
        "Switch[ngModel],Switch[formControlName]," +
        "switch[ngModel],switch[formControlName]",
    providers: [CHECKED_VALUE_ACCESSOR],
    host: {
        "(touch)": "onTouched()",
        "(checkedChange)": "onChange($event.value)",
    },
})
export class CheckedValueAccessor extends BaseValueAccessor<Switch> { // tslint:disable-line:directive-class-suffix
    onChange = (_: any) => {};
    onTouched = () => {};

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        this.view.checked = value;
    }

    registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
