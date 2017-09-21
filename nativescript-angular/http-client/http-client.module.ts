import { NgModule } from "@angular/core";

// IMPORTant: Importing "@angular/common/http" for the first time overwrites the
// global.__extends function.
const cachedExtends = global.__extends;
import { HttpClientModule, HttpBackend } from "@angular/common/http";
global.__extends = cachedExtends;

import { NSFileSystem } from "../file-system/ns-file-system";
import { NsHttpBackEnd } from "./ns-http-backend";

export { NsHttpBackEnd } from "./ns-http-backend";

@NgModule({
    providers: [
        NSFileSystem,
        NsHttpBackEnd,
        { provide: HttpBackend, useExisting: NsHttpBackEnd },
    ],
    imports: [
        HttpClientModule,
    ],
    exports: [
        HttpClientModule,
    ]
})
export class NativeScriptHttpClientModule {
}
