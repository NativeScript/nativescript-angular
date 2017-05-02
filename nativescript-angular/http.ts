import {
    Http, XHRBackend, RequestOptions
} from "@angular/http";
import { NSXSRFStrategy, NSHttp } from "./http/ns-http";
import { NSFileSystem } from "./file-system/ns-file-system";

import { NgModule } from "@angular/core";
import { HttpModule, XSRFStrategy } from "@angular/http";

export { NSHttp } from "./http/ns-http";

export function nsHttpFactory(backend, options, nsFileSystem) {
    return new NSHttp(backend, options, nsFileSystem);
}

export function nsXSRFStrategyFactory() {
    return new NSXSRFStrategy();
}

@NgModule({
    providers: [
        {provide: XSRFStrategy, useFactory: nsXSRFStrategyFactory},
        NSFileSystem,
        {provide: Http, useFactory: nsHttpFactory,
            deps: [XHRBackend, RequestOptions, NSFileSystem]}
    ],
    imports: [
        HttpModule,
    ],
    exports: [
        HttpModule,
    ]
})
export class NativeScriptHttpModule {
}
