import { ListViewComponent } from "./list-view-comp";
import { TemplateKeyDirective, SetupItemViewArgs, TemplatedItemsComponent } from "./templated-items-comp";
import { TabViewDirective, TabViewItemDirective } from "./tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./action-bar";
import { AndroidFilterComponent, IosFilterComponent } from "./platform-filters";
import { ModalDialogHost, ModalDialogOptions, ModalDialogParams, ModalDialogService } from "./dialogs";

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
    SetupItemViewArgs,
    TemplatedItemsComponent,
    TabViewDirective,
    TabViewItemDirective,
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective,
    AndroidFilterComponent,
    IosFilterComponent,
    ModalDialogHost,
    ModalDialogOptions,
    ModalDialogParams,
    ModalDialogService
};
