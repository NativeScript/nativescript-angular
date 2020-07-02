import { NgModule } from '@angular/core';

import { HttpClientModule, HttpBackend } from '@angular/common/http';

import { NSFileSystem } from '../file-system/ns-file-system';
import { NsHttpBackEnd } from './ns-http-backend';

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
