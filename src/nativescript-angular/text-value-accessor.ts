import {Directive, ElementRef, Renderer, Self, forwardRef, Provider} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from 'angular2/src/common/forms/directives/control_value_accessor';
import {isBlank, CONST_EXPR} from 'angular2/src/facade/lang';

const TEXT_VALUE_ACCESSOR = CONST_EXPR(new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => TextValueAccessor), multi: true}));

/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel}, {@link NgFormControl}, and {@link NgControlName} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]='model.test'>
 *  ```
 */
@Directive({
  selector: 'TextField[ngModel]',
  // TODO: vsavkin replace the above selector with the one below it once
  // https://github.com/angular/angular/issues/3011 is implemented
  // selector: '[ngControl],[ngModel],[ngFormControl]',
  host: {'(textChange)': 'onChange($event.value)'},
  bindings: [TEXT_VALUE_ACCESSOR]
})
export class TextValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) { }

  writeValue(value: any): void {
    var normalizedValue = isBlank(value) ? '' : value;
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'text', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
