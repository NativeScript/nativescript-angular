import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextValueAccessor, CheckedValueAccessor, DateValueAccessor, TimeValueAccessor, NumberValueAccessor, SelectedIndexValueAccessor } from './value-accessors';

export { TextValueAccessor, CheckedValueAccessor, DateValueAccessor, TimeValueAccessor, SelectedIndexValueAccessor, NumberValueAccessor };

@NgModule({
	declarations: [TextValueAccessor, CheckedValueAccessor, DateValueAccessor, TimeValueAccessor, SelectedIndexValueAccessor, NumberValueAccessor],
	providers: [],
	imports: [FormsModule],
	exports: [FormsModule, TextValueAccessor, CheckedValueAccessor, DateValueAccessor, TimeValueAccessor, SelectedIndexValueAccessor, NumberValueAccessor],
})
export class NativeScriptFormsModule {}
