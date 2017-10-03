import { Injectable } from "@angular/core";
import {
    Http,
    ConnectionBackend,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    ResponseOptions,
    ResponseType,
    Response
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";

import { isLocalRequest, handleLocalRequest } from "../http-client/http-utils";

import { NSFileSystem } from "../file-system/ns-file-system";

export class NSXSRFStrategy {
    public configureRequest(_req: any) {
        // noop
    }
}

@Injectable()
export class NSHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private nsFileSystem: NSFileSystem) {
        super(backend, defaultOptions);
    }

    /**
     * Performs a request with `request` http method.
     */
    request(req: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        const urlString = typeof req === "string" ? req : req.url;
        if (isLocalRequest(urlString)) {
            return this.handleLocalRequest(urlString);
        } else {
            return super.request(req, options);
        }
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (isLocalRequest(url)) {
            return this.handleLocalRequest(url);
        } else {
            return super.get(url, options);
        }
    }

    private handleLocalRequest(url: string): Observable<Response> {
        return handleLocalRequest(
            url,
            this.nsFileSystem,
            createResponse,
            createResponse
        );
    }
}

function createResponse(url: string, body: string | Object, status: number): Response {
    return new Response(new ResponseOptions({
        body: body,
        status: status,
        statusText: "OK",
        type: status === 200 ? ResponseType.Default : ResponseType.Error,
        url: url
    }));
}
