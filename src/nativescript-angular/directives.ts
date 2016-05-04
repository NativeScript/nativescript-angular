import {Type} from '@angular/core/src/facade/lang';
import {ListViewComponent, SetupItemViewArgs} from './directives/list-view-comp';
import {TextValueAccessor} from './value-accessors/text-value-accessor';
import {CheckedValueAccessor} from './value-accessors/checked-value-accessor';
import {DateValueAccessor} from './value-accessors/date-value-accessor';
import {TimeValueAccessor} from './value-accessors/time-value-accessor';
import {NumberValueAccessor} from './value-accessors/number-value-accessor';
import {SelectedIndexValueAccessor} from './value-accessors/selectedIndex-value-accessor';
import {TabViewDirective, TabViewItemDirective} from './directives/tab-view';
import {ActionBarComponent, ActionBarScope, ActionItemDirective, NavigationButtonDirective} from './directives/action-bar';
import {AndroidFilterComponent, IosFilterComponent} from './directives/platform-filters';

export const NS_DIRECTIVES: Type[] = [
    ListViewComponent,
    TabViewDirective,
    TabViewItemDirective,
    TextValueAccessor,
    CheckedValueAccessor,
    DateValueAccessor,
    TimeValueAccessor,
    SelectedIndexValueAccessor,
    NumberValueAccessor,
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective,
    AndroidFilterComponent,
    IosFilterComponent
];

export {ListViewComponent, SetupItemViewArgs} from './directives/list-view-comp';
export {TextValueAccessor} from './value-accessors/text-value-accessor';
export {CheckedValueAccessor} from './value-accessors/checked-value-accessor';
export {DateValueAccessor} from './value-accessors/date-value-accessor';
export {TimeValueAccessor} from './value-accessors/time-value-accessor';
export {NumberValueAccessor} from './value-accessors/number-value-accessor';
export {SelectedIndexValueAccessor} from './value-accessors/selectedIndex-value-accessor';
export {TabViewDirective, TabViewItemDirective} from './directives/tab-view';
export {ActionBarComponent, ActionBarScope, ActionItemDirective, NavigationButtonDirective} from './directives/action-bar';
export {AndroidFilterComponent, IosFilterComponent} from './directives/platform-filters';
