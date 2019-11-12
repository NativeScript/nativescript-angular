import { CommonModule } from "@angular/common";
import {
    NO_ERRORS_SCHEMA,
    NgModule,
} from "@angular/core";

import {
    ModalDialogService,
} from "./directives/dialogs";
import {
    defaultDeviceProvider,
    defaultFrameProvider,
    defaultPageProvider,
} from "./platform-providers";
// import { NS_DIRECTIVES } from "./directives";
import { ListViewComponent } from "./directives/list-view-comp";
import { TemplateKeyDirective, SetupItemViewArgs, TemplatedItemsComponent } from "./directives/templated-items-comp";
import { TabViewDirective, TabViewItemDirective } from "./directives/tab-view";
import {
    ActionBarComponent,
    ActionBarScope,
    ActionItemDirective,
    NavigationButtonDirective
} from "./directives/action-bar";
import { AndroidFilterComponent, IosFilterComponent } from "./directives/platform-filters";

@NgModule({
    declarations: [
      ListViewComponent,
      TemplateKeyDirective,
      TabViewDirective,
      TabViewItemDirective,
      ActionBarComponent,
      ActionBarScope,
      ActionItemDirective,
      NavigationButtonDirective,
      AndroidFilterComponent,
      IosFilterComponent
    ],
    providers: [
        ModalDialogService,
        defaultDeviceProvider,
        defaultFrameProvider,
        defaultPageProvider,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
      CommonModule,
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
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptCommonModule {
}

export * from "./directives";
