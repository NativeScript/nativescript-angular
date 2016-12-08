import { ControlValueAccessor } from "@angular/forms";

export function generateValueAccessorSelector(...tagNames: string[]): string {
    const tags: string[] = [];
    tagNames.forEach(tagName => {
        tags.push(tagName); // regular tag
        tags.push(tagName.charAt(0).toLowerCase() + tagName.slice(1)); // lowercase first char
        tags.push(tagName.split(/(?=[A-Z])/).join("-").toLowerCase()); // kebab case
    });

    const selectors = [];
    for (const tag of tags) {
        for (const directive of ["ngModel", "formControlName"]) {
            selectors.push(`${tag}[${directive}]`);
        }
    }
    return selectors.join(", ");
}

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
