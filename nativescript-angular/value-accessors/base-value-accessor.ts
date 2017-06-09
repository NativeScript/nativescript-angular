import { ControlValueAccessor } from "@angular/forms";

export class BaseValueAccessor<TView> implements ControlValueAccessor {
    private pendingChangeNotification: number = 0;
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

    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    writeValue(_: any) { }
}
