import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { isBlank, isDate } from "../lang-facade";
import { BaseValueAccessor, generateValueAccessorSelector } from "./base-value-accessor";
import { DatePicker } from "ui/date-picker";

const DATE_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateValueAccessor), multi: true};

/**
 * The accessor for setting a date and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <DatePicker [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector: generateValueAccessorSelector("DatePicker"),
    providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessor extends BaseValueAccessor<DatePicker> { // tslint:disable-line:directive-class-suffix
    @HostListener("dateChange", ["$event"])
    dateChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        let normalizedValue = isBlank(value) ? new Date() : value;
        if (!isDate(normalizedValue)) {
            if (typeof normalizedValue === "string") {
                normalizedValue = new Date(normalizedValue);
            } else if (typeof normalizedValue === "number") {
                normalizedValue = new Date(normalizedValue);
            }

            if (!isDate(normalizedValue)) {
                normalizedValue = new Date();
            }
        }
        this.view.date = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
