import {
    Http, XHRBackend, RequestOptions 
} from '@angular/http';
import { NSXSRFStrategy, NSHttp } from "./http/ns-http";
import { NSFileSystem } from "./file-system/ns-file-system";

import { NgModule } from "@angular/core";
import { HttpModule, XSRFStrategy } from "@angular/http";

@NgModule({
    providers: [
      { provide: XSRFStrategy, useValue: new NSXSRFStrategy() },
      NSFileSystem,
      {
        provide: Http, useFactory: (backend, options, nsFileSystem) => {
          return new NSHttp(backend, options, nsFileSystem);
        }, deps: [XHRBackend, RequestOptions, NSFileSystem]
      }
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
