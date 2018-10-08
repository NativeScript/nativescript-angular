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
        "TextField[ngModel],TextField[formControlName],TextField[formControl]," +
        "textField[ngModel],textField[formControlName],textField[formControl]," +
        "textfield[ngModel],textfield[formControlName],textfield[formControl]," +
        "text-field[ngModel],text-field[formControlName],text-field[formControl]," +

        "TextView[ngModel],TextView[formControlName],TextView[formControl]," +
        "textView[ngModel],textView[formControlName],textView[formControl]," +
        "textview[ngModel],textview[formControlName],textview[formControl]," +
        "text-view[ngModel],text-view[formControlName],text-view[formControl]," +

        "SearchBar[ngModel],SearchBar[formControlName],SearchBar[formControl]," +
        "searchBar[ngModel],searchBar[formControlName],searchBar[formControl]," +
        "searchbar[ngModel],searchbar[formControlName],searchbar[formControl]," +
        "search-bar[ngModel], search-bar[formControlName],search-bar[formControl]",
    providers: [TEXT_VALUE_ACCESSOR],
    host: {
        // "(blur)": "onTouched()", // Causes ExpressionChangedAfterItHasBeenCheckedError when using [formControlName] bindings in dynamic forms
        "(textChange)": "onChange($event.value)",
    },
})
export class TextValueAccessor extends BaseValueAccessor<TextView> { // tslint:disable-line:directive-class-suffix
    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        const normalized = super.normalizeValue(value);
        this.view.text = normalized;
    }
}
