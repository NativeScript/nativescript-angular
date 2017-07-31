import { CommonModule } from "@angular/common";
import {
    NO_ERRORS_SCHEMA,
    NgModule,
} from "@angular/core";

import {
    ModalDialogHost,
    ModalDialogService,
} from "./directives/dialogs";
import {
    defaultDeviceProvider,
    defaultFrameProvider,
    defaultPageProvider,
} from "./platform-providers";
import { NS_DIRECTIVES } from "./directives";

@NgModule({
    declarations: [
        ModalDialogHost,
        ...NS_DIRECTIVES,
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
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptCommonModule {
}
