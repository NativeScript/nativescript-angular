import { NSFileSystem } from '../file-system/ns-file-system';

import { Observable, Observer } from 'rxjs';
import { path } from '@nativescript/core/file-system/file-system';

export type httpResponseFactory<T> = (url: string, body: any, status: number) => T;
export type httpErrorFactory = (url: string, body: any, status: number) => any;

export function isLocalRequest(url: string): boolean {
    return url.indexOf('~') === 0 || url.indexOf('/') === 0;
}

export function getAbsolutePath(url: string, nsFileSystem: NSFileSystem): string {
    url = url.replace('~', '').replace('/', '');
    url = path.join(nsFileSystem.currentApp().path, url);
    return url;
}

export function processLocalFileRequest<T>(
    url: string,
    nsFileSystem: NSFileSystem,
    successResponse: httpResponseFactory<T>,
    errorResponse: httpErrorFactory): Observable<T> {

    url = getAbsolutePath(url, nsFileSystem);

    // request from local app resources
    return new Observable((observer: Observer<T>) => {
        if (nsFileSystem.fileExists(url)) {
            const localFile = nsFileSystem.fileFromPath(url);
            localFile.readText()
                .then((data) => {
                    try {
                        const json = JSON.parse(data);
                        observer.next(successResponse(url, json, 200));
                        observer.complete();
                    } catch (error) {
                        // Even though the response status was 2xx, this is still an error.
                        // The parse error contains the text of the body that failed to parse.
                        const errorResult = { error, text: data };
                        observer.error(errorResponse(url, errorResult, 200));
                    }
                }, (err: Object) => {
                    observer.error(errorResponse(url, err, 400));

                });
        } else {
            observer.error(errorResponse(url, 'Not Found', 404));
        }
    });
}
