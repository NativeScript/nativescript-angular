import { ListViewComponent } from "./list-view-comp";
import { TemplateKeyDirective } from "./templated-items-comp";
import { TabViewDirective, TabViewItemDirective } from "./tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
import { AndroidFilterComponent } from "./platform-filter-android";
import { IosFilterComponent } from "./platform-filter-ios";
import { DetachedLoader } from "./detached-loader";

export { ListViewComponent } from "./list-view-comp";
export { SetupItemViewArgs, TemplateKeyDirective } from "./templated-items-comp";

export { TabViewDirective, TabViewItemDirective } from "./tab-view";
export {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";

export { AndroidFilterComponent } from "./platform-filter-android";
export { IosFilterComponent } from "./platform-filter-ios";
export { DetachedLoader } from "./detached-loader";
export { TemplatedItemsComponent } from "./templated-items-comp";

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
    DetachedLoader,
];
