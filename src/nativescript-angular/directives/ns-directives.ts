import {Type} from 'angular2/src/facade/lang';
import {ListViewComponent} from './list-view-comp';
import {TextValueAccessor} from '../value-accessors/text-value-accessor';
import {CheckedValueAccessor} from '../value-accessors/checked-value-accessor';
import {TabViewDirective, TabViewItemDirective} from './tab-view';

export const NS_DIRECTIVES: Type[] = [
    ListViewComponent,

    TabViewDirective,
    TabViewItemDirective,

    TextValueAccessor,
    CheckedValueAccessor
];
