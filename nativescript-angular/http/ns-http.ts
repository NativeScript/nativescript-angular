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
            return this._requestLocalUrl(urlString);
        } else {
            return super.request(req, options);
        }
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (isLocalRequest(url)) {
            return this._requestLocalUrl(url);
        } else {
            return super.get(url, options);
        }
    }

    /**
     * Uses a local file if `~/` resource is requested.
     * @param url
     */
    private _requestLocalUrl(url: string): Observable<Response> {
        url = normalizeLocalUrl(url);

        // request from local app resources
        return Observable.fromPromise<Response>(new Promise((resolve, reject) => {
            let app = this.nsFileSystem.currentApp();
            let localFile = app.getFile(url);
            if (localFile) {
                localFile.readText().then((data) => {
                    resolve(responseOptions(data, 200, url));
                }, (err: Object) => {
                    reject(responseOptions(err, 400, url));
                });
            } else {
                reject(responseOptions("Not Found", 404, url));
            }
        }));
    }
}

function isLocalRequest(url: string): boolean {
    return url.indexOf("~") === 0 || url.indexOf("/") === 0;
}

function normalizeLocalUrl(url: string): string {
    return url.replace("~", "").replace("/", "");
}

function responseOptions(body: string | Object, status: number, url: string): Response {
    return new Response(new ResponseOptions({
        body: body,
        status: status,
        statusText: "OK",
        type: status === 200 ? ResponseType.Default : ResponseType.Error,
        url: url
    }));
}
