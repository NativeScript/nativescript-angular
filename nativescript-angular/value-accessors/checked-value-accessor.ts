import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { isBlank } from "../lang-facade";
import { BaseValueAccessor } from "./base-value-accessor";
import { Switch } from "ui/switch";

const CHECKED_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckedValueAccessor), multi: true};

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
    selector: "Switch[ngModel], switch[ngModel]", // tslint:disable-line:directive-selector
    providers: [CHECKED_VALUE_ACCESSOR]
})
export class CheckedValueAccessor extends BaseValueAccessor<Switch> { // tslint:disable-line:directive-class-suffix
    @HostListener("checkedChange", ["$event"])
    checkedChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        let normalizedValue = false;
        if (!isBlank(value)) {
            if (typeof value === "string") {
                normalizedValue = value.toLowerCase() === "true" ? true : false;
            } else {
                normalizedValue = !!value;
            }
        }
        this.view.checked = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
