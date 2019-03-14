import { ControlValueAccessor } from "@angular/forms";
import { View, unsetValue } from "tns-core-modules/ui/core/view";

import { isBlank } from "nativescript-angular/lang-facade";

export class BaseValueAccessor<TView extends View> implements ControlValueAccessor {
    private pendingChangeNotification: any = 0;
    onChange = (_) => { };
    onTouched = () => {};

    constructor(public view: TView) { }

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = (arg) => {
            if (this.pendingChangeNotification) {
                clearTimeout(this.pendingChangeNotification);
            }
            this.pendingChangeNotification = setTimeout(() => {
                this.pendingChangeNotification = 0;
                fn(arg);
            }, 20);
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.view.isEnabled = !isDisabled;
    }

    writeValue(_: any) {}

    protected normalizeValue(value: any): any {
        return isBlank(value) ? unsetValue : value;
    }
}
