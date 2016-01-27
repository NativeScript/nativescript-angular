import {Type} from 'angular2/src/facade/lang';
import {ListItemTemplate, ListViewDirective} from './list-view';
import {TextValueAccessor} from '../text-value-accessor';
import {TabViewDirective, TabViewItemDirective} from './tab-view';

export const NS_DIRECTIVES: Type[] = [
    ListItemTemplate,
    ListViewDirective,

    TabViewDirective,
    TabViewItemDirective,

    TextValueAccessor
];
