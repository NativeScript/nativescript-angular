import {Type} from 'angular2/src/facade/lang';
import {ListViewComponent} from './list-view-comp';
import {TextValueAccessor} from '../value-accessors/text-value-accessor';
import {CheckedValueAccessor} from '../value-accessors/checked-value-accessor';
import {DateValueAccessor} from '../value-accessors/date-value-accessor';
import {TimeValueAccessor} from '../value-accessors/time-value-accessor';
import {NumberValueAccessor} from '../value-accessors/number-value-accessor';
import {SelectedIndexValueAccessor} from '../value-accessors/selectedIndex-value-accessor';
import {TabViewDirective, TabViewItemDirective} from './tab-view';
import {ActionBarComponent, ActionBarScope, ActionItemDirective, NavigationButtonDirective} from './action-bar';
import {AndroidFilterComponent, IosFilterComponent} from './platform-filters';

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
