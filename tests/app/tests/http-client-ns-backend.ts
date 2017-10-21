// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { NSFileSystem } from "nativescript-angular/file-system/ns-file-system";
import { NsHttpBackEnd } from "nativescript-angular/http-client";

import { XhrFactory, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { File } from "tns-core-modules/file-system";

class NSFileSystemMock implements NSFileSystem {
    public currentApp(): any {
        return { path: "/app/dir" };
    }

    public fileFromPath(path: string): any {
        if (path === "/app/dir/data.json") {
            return {
                readText: () => { return Promise.resolve(` { "result": "success" } `); }
            };
        }
        throw new Error("Opening non-existing file");
    }

    public fileExists(path: string): boolean {
        return path === "/app/dir/data.json";
    }
}
class XhrFactoryMock implements XhrFactory {
    build(): XMLHttpRequest {
        throw new Error("Hi, from XhrFactoryMock!");
    }
}

describe("NsHttpBackEnd ", () => {
    let backend: NsHttpBackEnd;

    before(() => {
        backend = new NsHttpBackEnd(new XhrFactoryMock(), new NSFileSystemMock());
    });

    it("should work with local files prefixed with '~'", (done) => {
        const req = new HttpRequest("GET", "~/data.json");
        let nextCalled = false;
        backend.handle(req).subscribe(
            (response: HttpResponse<{ result: string }>) => {
                assert.equal(response.body.result, "success");
                nextCalled = true;
            }, (error) => {
                done(error);
            }, () => {
                assert.isTrue(nextCalled, "next callback should be called with result.");
                done();
            });
    });

    it("should return 404 for non-existing local files prefixed with '~'", (done) => {
        const req = new HttpRequest("GET", "~/non/existing/file.json");
        backend.handle(req).subscribe(
            (response) => {
                assert.fail("next callback should not be called for non existing file.");
            }, (error: HttpErrorResponse) => {
                assert.equal(error.status, 404);
                done();
            }, () => {
                assert.fail("next callback should not be called for non existing file.");
            });
    });

    it("should fallback to XHR backend when requesting remote files", (done) => {
        const req = new HttpRequest("GET", "https://nativescript.org/");
        backend.handle(req).subscribe(
            (response) => {
                assert.fail("next callback should not be called for non existing file.");
            }, (error: Error) => {
                assert.equal(error.message, "Hi, from XhrFactoryMock!");
                done();
            }, () => {
                assert.fail("next callback should not be called for non existing file.");
            });
    });
});
