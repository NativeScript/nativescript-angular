import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { TimePicker } from "tns-core-modules/ui/time-picker";

const TIME_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimeValueAccessor), multi: true};

/**
 * The accessor for setting a time and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TimePicker [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "TimePicker[ngModel], TimePicker[formControlName], timePicker[ngModel], timePicker[formControlName], time-picker[ngModel], time-picker[formControlName]",
    providers: [TIME_VALUE_ACCESSOR]
})
export class TimeValueAccessor extends BaseValueAccessor<TimePicker> { // tslint:disable-line:directive-class-suffix
    @HostListener("timeChange", ["$event"])
    timeChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        this.view.time = value;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
