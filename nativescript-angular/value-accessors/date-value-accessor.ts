import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { DatePicker } from "tns-core-modules/ui/date-picker";

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
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "DatePicker[ngModel], DatePicker[formControlName], datePicker[ngModel], datePicker[formControlName], date-picker[ngModel], date-picker[formControlName]",
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
        this.view.date = value;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
