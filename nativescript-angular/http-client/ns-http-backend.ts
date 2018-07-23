import { Injectable } from "@angular/core";
import {
    HttpRequest, HttpEvent,
    XhrFactory, HttpResponse,
    HttpErrorResponse, HttpXhrBackend
} from "@angular/common/http";
import { Observable } from "rxjs";

import { NSFileSystem } from "../file-system/ns-file-system";
import { isLocalRequest, processLocalFileRequest } from "./http-utils";

@Injectable()
export class NsHttpBackEnd extends HttpXhrBackend {
    constructor(xhrFactory: XhrFactory, private nsFileSystem: NSFileSystem) {
        super(xhrFactory);
    }

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        let result: Observable<HttpEvent<any>>;

        if (isLocalRequest(req.url)) {
            result = this.handleLocalFileRequest(req.url);
        } else {
            result = super.handle(req);
        }

        return result;
    }

    private handleLocalFileRequest(url: string): Observable<HttpEvent<any>> {
        return processLocalFileRequest(
            url,
            this.nsFileSystem,
            createSuccessResponse,
            createErrorResponse
        );
    }
}

function createSuccessResponse(
    url: string,
    body: any,
    status: number): HttpEvent<any> {
    return new HttpResponse({
        url,
        body,
        status,
        statusText: "OK"
    });
}

function createErrorResponse(
    url: string,
    body: any,
    status: number): HttpErrorResponse {
    return new HttpErrorResponse({
        url,
        error: body,
        status,
        statusText: "ERROR"
    });
}
