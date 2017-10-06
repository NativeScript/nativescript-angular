import { ListViewComponent, TemplateKeyDirective } from "./list-view-comp";
import { TabViewDirective, TabViewItemDirective } from "./tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
import { AndroidFilterComponent, IosFilterComponent } from "./platform-filters";

export {
    ListViewComponent,
    SetupItemViewArgs,
    TemplateKeyDirective
} from "./list-view-comp";

export { TabViewDirective, TabViewItemDirective } from "./tab-view";
export {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
export { AndroidFilterComponent, IosFilterComponent } from "./platform-filters";

export const NS_DIRECTIVES = [
    ListViewComponent,
    TemplateKeyDirective,
    TabViewDirective,
    TabViewItemDirective,
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective,
    AndroidFilterComponent,
    IosFilterComponent,
];
