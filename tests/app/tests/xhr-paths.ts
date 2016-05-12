//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {FileSystemXHR} from "nativescript-angular/xhr";

describe("XHR name resolution", () => {
    it("resolves relative paths from app root", () => {
        const xhr = new FileSystemXHR();
        assert.strictEqual("/app/dir/mydir/mycomponent.html", xhr.resolve("mydir/mycomponent.html", "/app/dir"))
    });

    it("resolves absolute paths as is", () => {
        const xhr = new FileSystemXHR();
        assert.strictEqual("//app/mydir/mycomponent.html", xhr.resolve("//app/mydir/mycomponent.html", "/app/dir"))
    });
})
