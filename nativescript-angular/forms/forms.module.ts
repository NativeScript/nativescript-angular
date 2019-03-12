import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    TextValueAccessor,
    CheckedValueAccessor,
    DateValueAccessor,
    TimeValueAccessor,
    NsNumberValueAccessor,
    SelectedIndexValueAccessor
} from "./value-accessors";

export const FORMS_DIRECTIVES = [
    TextValueAccessor,
    CheckedValueAccessor,
    DateValueAccessor,
    TimeValueAccessor,
    SelectedIndexValueAccessor,
    NsNumberValueAccessor,
];

@NgModule({
    declarations: FORMS_DIRECTIVES,
    providers: [
    ],
    imports: [
        FormsModule
    ],
    exports: [
        FormsModule,
        FORMS_DIRECTIVES,
    ]
})
export class NativeScriptFormsModule {
}
