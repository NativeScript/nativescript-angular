import {Injectable} from "@angular/core";
import {
    Http,
    ConnectionBackend,
    RequestOptionsArgs,
    ResponseOptions,
    ResponseType,
    Response
} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import {NSFileSystem} from "../file-system/ns-file-system";

export class NSXSRFStrategy {
  public configureRequest(_req: any) {
    // noop
  }
}

@Injectable()
export class NSHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: any, private nsFileSystem: NSFileSystem) {
    super(backend, defaultOptions);
  }

  /**
   * Performs a request with `get` http method.
   * Uses a local file if `~/` resource is requested.
   */
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    if (url.indexOf("~") === 0 || url.indexOf("/") === 0) {
      // normalize url
      url = url.replace("~", "").replace("/", "");
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
    } else {
      return super.get(url, options);
    }
  }
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
