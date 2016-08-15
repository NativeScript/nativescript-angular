import {Directive, ElementRef, Renderer, Self, forwardRef, provide} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {isBlank} from '@angular/core/src/facade/lang';
import {BaseValueAccessor} from './base-value-accessor'
import {View} from "ui/core/view";

const TEXT_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => TextValueAccessor), multi: true });

export type TextView = {text: string} & View;

/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
    selector: 'TextField[ngModel], TextView[ngModel], SearchBar[ngModel]',
    host: { '(textChange)': 'onChange($event.value)' },
    providers: [TEXT_VALUE_ACCESSOR]
})
export class TextValueAccessor extends BaseValueAccessor<TextView> {
    onTouched = () => { };

    constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    writeValue(value: any): void {
        var normalizedValue = isBlank(value) ? '' : value.toString();
        this.view.text = normalizedValue;
    }

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
