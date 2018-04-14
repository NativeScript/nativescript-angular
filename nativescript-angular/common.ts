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
    FrameService,
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
        FrameService,
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
