import { NO_ERRORS_SCHEMA, NgModule, } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
    ModalDialogService,
} from "./dialogs";

import {
    defaultDeviceProvider,
    defaultFrameProvider,
    defaultPageProvider,
} from "nativescript-angular/core";

// import { NS_DIRECTIVES } from "./directives";
import {
    NS_DIRECTIVES
} from "./directives";
@NgModule({
    declarations: [
        ...NS_DIRECTIVES
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
