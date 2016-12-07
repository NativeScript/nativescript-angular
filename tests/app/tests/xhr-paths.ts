//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {FileSystemResourceLoader} from "nativescript-angular";

describe("XHR name resolution", () => {
    it("resolves relative paths from app root", () => {
        const xhr = new FileSystemResourceLoader();
        assert.strictEqual("/app/dir/mydir/mycomponent.html", xhr.resolve("mydir/mycomponent.html", "/app/dir"))
    });

    it("resolves double-slashed absolute paths as is", () => {
        const xhr = new FileSystemResourceLoader();
        assert.strictEqual("//app/mydir/mycomponent.html", xhr.resolve("//app/mydir/mycomponent.html", "/app/dir"))
    });

    it("resolves single-slashed absolute paths as is", () => {
        const xhr = new FileSystemResourceLoader();
        assert.strictEqual("/data/data/app/mydir/mycomponent.html", xhr.resolve("/data/data/app/mydir/mycomponent.html", "/app/dir"))
    });
})
