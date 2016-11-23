import {ControlValueAccessor} from "@angular/forms";

export class BaseValueAccessor<TView> implements ControlValueAccessor {
    constructor(public view: TView) { }

    onChange = (_) => { };
    private pendingChangeNotification: number = 0;

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

    writeValue(_: any) {
        //
    }

    registerOnTouched(_: () => void): void {
        // 
    }
}
