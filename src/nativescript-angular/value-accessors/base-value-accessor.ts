import {ControlValueAccessor} from 'angular2/src/common/forms/directives/control_value_accessor';

export class BaseValueAccessor implements ControlValueAccessor {
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
        }
    }
    
    writeValue(value: any) {
        //
    }
    
    registerOnTouched(fn: () => void): void {
        // 
    }
}