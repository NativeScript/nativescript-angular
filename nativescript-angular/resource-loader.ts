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
    constructor(private fs: NSFileSystem) {
        super();
    }

    get(url: string): Promise<string> {
        const resolvedPath = this.resolve(url);

        const templateFile = this.fs.fileFromPath(resolvedPath);

        return templateFile.readText();
    }

    resolveRelativeUrls(url: string): string {
        // Angular assembles absolute URLs and prefixes them with //
        if (url.indexOf("/") !== 0) {
            // Resolve relative URLs based on the app root.
            return path.join(this.fs.currentApp().path, url);
        } else {
            return url;
        }
    }

    resolve(url: string) {
        const normalizedUrl = this.resolveRelativeUrls(url);

        if (this.fs.fileExists(normalizedUrl)) {
            return normalizedUrl;
        }

        const fallbackCandidates = [];
        extensionsFallbacks.forEach(([extension, fallback]) => {
            if (normalizedUrl.endsWith(extension)) {
                fallbackCandidates.push(normalizedUrl.substr(0, normalizedUrl.length - extension.length) + fallback);
            }
        });

        for (let i = 0; i < fallbackCandidates.length; i++) {
            if (this.fs.fileExists(fallbackCandidates[i])) {
                return fallbackCandidates[i];
            }
        }

        throw new Error(`Could not resolve ${url}. Looked for: ${normalizedUrl}, ${fallbackCandidates}`);
    }
}
