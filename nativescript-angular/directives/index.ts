import { ListViewComponent } from "./list-view-comp";
import { TemplateKeyDirective, TemplatedItemsComponent } from "./templated-items-comp";
import { TabViewDirective, TabViewItemDirective } from "./tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
import { AndroidFilterComponent, IosFilterComponent } from "./platform-filters";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService } from "./dialogs";

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

export {
    ListViewComponent,
    TemplateKeyDirective,
    TemplatedItemsComponent,
    TabViewDirective,
    TabViewItemDirective,
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective,
    AndroidFilterComponent,
    IosFilterComponent,
    ModalDialogOptions,
    ModalDialogParams,
    ModalDialogService
};
