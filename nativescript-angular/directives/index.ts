import { ListViewComponent } from "./list-view-comp";
import { TemplateKeyDirective } from "./templated-items-comp";
import { TabViewDirective, TabViewItemDirective } from "./tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
import { AndroidFilterComponent, IosFilterComponent } from "./platform-filters";

export { ListViewComponent } from "./list-view-comp";
export { SetupItemViewArgs, TemplateKeyDirective } from "./templated-items-comp";

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
