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
import { NS_DIRECTIVES } from "./directives";

export * from "./directives";

@NgModule({
    declarations: [
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
        ...NS_DIRECTIVES,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptCommonModule {
}
