import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { Switch } from "tns-core-modules/ui/switch";

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
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "Switch[ngModel], Switch[formControlName], switch[ngModel], switch[formControlName], switch[ngModel], switch[formControlName]",
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
        this.view.checked = value;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
