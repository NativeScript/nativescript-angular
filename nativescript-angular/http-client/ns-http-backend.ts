import { Injectable } from "@angular/core";
import {
    HttpRequest, HttpEvent,
    XhrFactory, HttpResponse,
    HttpErrorResponse, HttpXhrBackend
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { NSFileSystem } from "../file-system/ns-file-system";
import { path } from "tns-core-modules/file-system";

@Injectable()
export class NsHttpBackEnd extends HttpXhrBackend {
    constructor(xhrFactory: XhrFactory, private nsFileSystem: NSFileSystem) {
        super(xhrFactory);
    }

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        let result: Observable<HttpEvent<any>>;

        if (isLocalRequest(req.url)) {
            result = this.handleLocalRequest(req.url);
        } else {
            result = super.handle(req);
        }

        return result;
    }

    private getAbsolutePath(url: string): string {
        url = url.replace("~", "").replace("/", "");
        url = path.join(this.nsFileSystem.currentApp().path, url);
        return url;
    }

    private handleLocalRequest(url: string): Observable<HttpEvent<any>> {
        url = this.getAbsolutePath(url);

        // request from local app resources
        return new Observable((observer: Observer<HttpEvent<any>>) => {
            if (this.nsFileSystem.fileExists(url)) {
                const localFile = this.nsFileSystem.fileFromPath(url);
                localFile.readText()
                    .then((data) => {
                        try {
                            const json = JSON.parse(data);
                            observer.next(createSuccessResponse(url, json, 200));
                            observer.complete();
                        } catch (error) {
                            // Even though the response status was 2xx, this is still an error.
                            // The parse error contains the text of the body that failed to parse.
                            const errorResult = { error, text: data };
                            observer.error(createErrorResponse(url, errorResult, 200));
                        }
                    }, (err: Object) => {
                        observer.error(createErrorResponse(url, err, 400));

                    });
            } else {
                observer.error(createErrorResponse(url, "Not Found", 404));
            }
        });
    }
}

function isLocalRequest(url: string): boolean {
    return url.indexOf("~") === 0 || url.indexOf("/") === 0;
}

function createSuccessResponse(url: string, body: any, status: number): HttpEvent<any> {
    return new HttpResponse({
        url,
        body,
        status,
        statusText: "OK"
    });
}

function createErrorResponse(url: string, body: any, status: number): HttpErrorResponse {
    return new HttpErrorResponse({
        url,
        error: body,
        status,
        statusText: "ERROR"
    });
}
