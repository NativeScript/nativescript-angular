import { ResourceLoader } from "@angular/compiler";
import { File, knownFolders, path } from "tns-core-modules/file-system";

const extensionsFallbacks = [
    [".scss", ".css"],
    [".sass", ".css"],
    [".less", ".css"]
];

export class FileSystemResourceLoader extends ResourceLoader {
    get(url: string): Promise<string> {
        const resolvedPath = this.resolve(url);

        const templateFile = File.fromPath(resolvedPath);

        return templateFile.readText();
    }

    private handleAbsoluteUrls(url: string): string {
        // Angular assembles absolute URLs and prefixes them with //
        if (url.indexOf("/") !== 0) {
            // Resolve relative URLs based on the app root.
            return path.join(knownFolders.currentApp().path, url);
        } else {
            return url;
        }
    }

    private resolve(url: string) {
        const normalizedUrl = this.handleAbsoluteUrls(url);

        if (File.exists(normalizedUrl)) {
            return normalizedUrl;
        }

        const fallbackCandidates = [];
        extensionsFallbacks.forEach(([extension, fallback]) => {
            if (normalizedUrl.endsWith(extension)) {
                fallbackCandidates.push(normalizedUrl.substr(0, normalizedUrl.length - extension.length) + fallback);
            }
        });

        for (let i = 0; i < fallbackCandidates.length; i++) {
            if (File.exists(fallbackCandidates[i])) {
                return fallbackCandidates[i];
            }
        }

        throw new Error(`Could not resolve ${url}. Looked for: ${normalizedUrl}, ${fallbackCandidates}`);
    }
}
