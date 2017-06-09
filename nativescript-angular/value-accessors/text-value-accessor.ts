import { Directive, ElementRef, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseValueAccessor } from "./base-value-accessor";
import { View } from "tns-core-modules/ui/core/view";

const TEXT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextValueAccessor),
    multi: true,
};

export type TextView = {text: string} & View;

/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector:
        "TextField[ngModel],TextField[formControlName]," +
        "textField[ngModel],textField[formControlName]," +
        "textfield[ngModel],textfield[formControlName]," +
        "text-field[ngModel],text-field[formControlName]," +

        "TextView[ngModel],TextView[formControlName]," +
        "textView[ngModel],textView[formControlName]," +
        "textview[ngModel],textview[formControlName]," +
        "text-view[ngModel],text-view[formControlName]," +

        "SearchBar[ngModel],SearchBar[formControlName]," +
        "searchBar[ngModel],searchBar[formControlName]," +
        "searchbar[ngModel],searchbar[formControlName]," +
        "search-bar[ngModel], search-bar[formControlName]",
    providers: [TEXT_VALUE_ACCESSOR],
    host: {
        "(touch)": "onTouched()",
        "(textChange)": "onChange($event.value)",
    },
})
export class TextValueAccessor extends BaseValueAccessor<TextView> { // tslint:disable-line:directive-class-suffix
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        this.view.text = value;
    }
}
