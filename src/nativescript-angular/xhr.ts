import {path, knownFolders, File} from "file-system";
import {XHR} from "@angular/compiler/src/xhr";

export class FileSystemXHR extends XHR {
    resolve(url: string, baseUrl: string): string {
        //Angular assembles absolute URL's and prefixes them with //
        if (url.indexOf("//") !== 0) {
            //Resolve relative URL's based on the app root.
            return path.join(baseUrl, url);
        } else {
            return url;
        }
    }

    get(url: string): Promise<string> {
        const appDir = knownFolders.currentApp().path;
        const templatePath = this.resolve(url, appDir);

        if (!File.exists(templatePath)) {
            throw new Error(`File ${templatePath} does not exist. Resolved from: ${url}.`);
        }
        let templateFile = File.fromPath(templatePath);
        return templateFile.readText();
    }
}
