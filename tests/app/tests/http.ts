//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {
    async,
    inject,
    beforeEach,
    beforeEachProviders
} from '@angular/core/testing';
import {ReflectiveInjector} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http, HTTP_PROVIDERS, Response, ResponseOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {MockBackend} from '@angular/http/testing';
import {NSHttp} from "nativescript-angular/http/ns-http";
import {NSFileSystem} from "nativescript-angular/file-system/ns-file-system";
import {NSFileSystemMock, FileResponses} from './mocks/ns-file-system.mock';

describe("Http", () => {
    let http: Http;
    let backend: MockBackend;

    beforeEach(() => {
        let injector = ReflectiveInjector.resolveAndCreate([
            BaseRequestOptions,
            MockBackend,
            { provide: NSFileSystem, useClass: NSFileSystemMock },
            {
              provide: Http, 
              useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions, nsFileSystem: NSFileSystem) {
                //HACK: cast backend to any to work around an angular typings problem
                return new NSHttp(<any>backend, defaultOptions, nsFileSystem);
              },
              deps: [MockBackend, BaseRequestOptions, NSFileSystem]
            }
        ]);

        backend = injector.get(MockBackend);
        http = injector.get(Http);
    });

    it("should work with local files prefixed with '~'", () => {
        http.get('~/test.json').map(res => res.json()).subscribe((response: any) => {
            assert.strictEqual(3, response.length);
            assert.strictEqual('Alex', response[0].name);
        });
    });

    it("should work with local files prefixed with '/'", () => {
        http.get('/test.json').map(res => res.json()).subscribe((response: any) => {
            assert.strictEqual(3, response.length);
            assert.strictEqual('Panayot', response[2].name);
        });
    });

    it("should work with remote files", () => {
        let connection: any;
        backend.connections.subscribe((c: any) => connection = c);
        http.get('http://www.nativescript.org/test.json').map(res => res.json()).subscribe((response: any) => {
            assert.strictEqual(3, response.length);
            assert.strictEqual('Rosen', response[1].name);
        });
        connection.mockRespond(new Response(new ResponseOptions({ body: FileResponses.AWESOME_TEAM })));
    });
});
