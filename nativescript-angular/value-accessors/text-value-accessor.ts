import { Directive, ElementRef, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { isBlank } from "../lang-facade";
import { BaseValueAccessor } from "./base-value-accessor";
import { View } from "ui/core/view";

const TEXT_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextValueAccessor), multi: true};

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
    // tslint:disable-next-line:max-line-length directive-selector
    selector: "TextField[ngModel], TextField[formControlName], textField[ngModel], textField[formControlName], text-field[ngModel], text-field[formControlName], TextView[ngModel], TextView[formControlName], textView[ngModel], textView[formControlName], text-view[ngModel], text-view[formControlName], SearchBar[ngModel], SearchBar[formControlName], searchBar[ngModel], searchBar[formControlName], search-bar[ngModel], search-bar[formControlName]",
    providers: [TEXT_VALUE_ACCESSOR]
})
export class TextValueAccessor extends BaseValueAccessor<TextView> { // tslint:disable-line:directive-class-suffix
    @HostListener("textChange", ["$event"])
    textChangeListener(event: any) {
        this.onChange(event.value);
    }

    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        let normalizedValue = isBlank(value) ? "" : value.toString();
        this.view.text = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
