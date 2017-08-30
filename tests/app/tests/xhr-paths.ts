// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { FileSystemResourceLoader } from "nativescript-angular/resource-loader";

import { File } from "tns-core-modules/file-system";
import { NSFileSystem } from "nativescript-angular/file-system/ns-file-system";

class NSFileSystemMock {
    public currentApp(): any {
        return { path: "/app/dir" };
    }

    public fileFromPath(path: string): File {
        return null;
    }

    public fileExists(path: string): boolean {
        // mycomponent.html always exists
        // mycomponent.css is the other file
        return path.indexOf("mycomponent.html") >= 0 || path === "/app/dir/mycomponent.css";
    }
}
const fsMock = new NSFileSystemMock();

describe("XHR name resolution", () => {
    let resourceLoader: FileSystemResourceLoader;
    before(() => {
        resourceLoader = new FileSystemResourceLoader(new NSFileSystemMock());
    });

    it("resolves relative paths from app root", () => {
        assert.strictEqual("/app/dir/mydir/mycomponent.html", resourceLoader.resolve("mydir/mycomponent.html"));
    });

    it("resolves double-slashed absolute paths as is", () => {
        assert.strictEqual("//app/mydir/mycomponent.html", resourceLoader.resolve("//app/mydir/mycomponent.html"));
    });

    it("resolves single-slashed absolute paths as is", () => {
        assert.strictEqual(
            "/data/data/app/mydir/mycomponent.html",
            resourceLoader.resolve("/data/data/app/mydir/mycomponent.html"));
    });

    it("resolves existing CSS file", () => {
        assert.strictEqual(
            "/app/dir/mycomponent.css",
            resourceLoader.resolve("mycomponent.css"));
    });

    it("resolves non-existing .scss file to existing .css file", () => {
        assert.strictEqual(
            "/app/dir/mycomponent.css",
            resourceLoader.resolve("mycomponent.scss"));
    });

    it("resolves non-existing .sass file to existing .css file", () => {
        assert.strictEqual(
            "/app/dir/mycomponent.css",
            resourceLoader.resolve("mycomponent.sass"));
    });

    it("resolves non-existing .less file to existing .css file", () => {
        assert.strictEqual(
            "/app/dir/mycomponent.css",
            resourceLoader.resolve("mycomponent.less"));
    });
});
