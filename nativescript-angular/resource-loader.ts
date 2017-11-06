import { Injectable } from "@angular/core";
import { ResourceLoader } from "@angular/compiler";
import { path } from "tns-core-modules/file-system";

import { NSFileSystem } from "./file-system/ns-file-system";

const extensionsFallbacks = [
    [".scss", ".css"],
    [".sass", ".css"],
    [".less", ".css"]
];

@Injectable()
export class FileSystemResourceLoader extends ResourceLoader {
    fs: NSFileSystem;

    constructor() {
        super();

        this.fs = new NSFileSystem();
    }

    get(url: string): Promise<string> {
        const resolvedPath = this.resolve(url);

        const templateFile = this.fs.fileFromPath(resolvedPath);

        return templateFile.readText();
    }

    resolve(url: string): string {
        const normalizedUrl = this.resolveRelativeUrls(url);

        if (this.fs.fileExists(normalizedUrl)) {
            return normalizedUrl;
        }

        const { candidates: fallbackCandidates, resource: fallbackResource } =
            this.fallbackResolve(normalizedUrl);

        if (fallbackResource) {
            return fallbackResource;
        }

        throw new Error(`Could not resolve ${url}. Looked for: ${normalizedUrl}, ${fallbackCandidates}`);
    }

    private resolveRelativeUrls(url: string): string {
        // Angular assembles absolute URLs and prefixes them with //
        if (url.indexOf("/") !== 0) {
            // Resolve relative URLs based on the app root.
            return path.join(this.fs.currentApp().path, url);
        } else {
            return url;
        }
    }

    private fallbackResolve(url: string):
        ({ resource: string, candidates: string[] }) {

        const candidates = extensionsFallbacks
            .filter(([extension]) => url.endsWith(extension))
            .map(([extension, fallback]) =>
                this.replaceExtension(url, extension, fallback));

        const resource = candidates.find(candidate => this.fs.fileExists(candidate));

        return { candidates, resource };
    }

    private replaceExtension(fileName: string, oldExtension: string, newExtension: string): string {
        const baseName = fileName.substr(0, fileName.length - oldExtension.length);
        return baseName + newExtension;
    }
}

