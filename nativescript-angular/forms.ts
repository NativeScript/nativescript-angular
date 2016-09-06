import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TextValueAccessor } from './value-accessors/text-value-accessor';
import { CheckedValueAccessor } from './value-accessors/checked-value-accessor';
import { DateValueAccessor } from './value-accessors/date-value-accessor';
import { TimeValueAccessor } from './value-accessors/time-value-accessor';
import { NumberValueAccessor } from './value-accessors/number-value-accessor';
import { SelectedIndexValueAccessor } from './value-accessors/selectedIndex-value-accessor';

export const FORMS_DIRECTIVES = [
    TextValueAccessor,
    CheckedValueAccessor,
    DateValueAccessor,
    TimeValueAccessor,
    SelectedIndexValueAccessor,
    NumberValueAccessor,
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
