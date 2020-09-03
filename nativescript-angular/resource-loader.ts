import { Injectable } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { path } from '@nativescript/core';

import { NSFileSystem } from './file-system/ns-file-system';

const sourceExtensionsMap = {
	'.scss': '.css',
	'.sass': '.css',
	'.less': '.css',
};

@Injectable()
export class FileSystemResourceLoader extends ResourceLoader {
	constructor(private fs: NSFileSystem) {
		super();
	}

	get(url: string): string {
		const resolvedPath = this.resolve(url);

		const templateFile = this.fs.fileFromPath(resolvedPath);

		return templateFile.readTextSync();
	}

	resolve(url: string): string {
		const normalizedSourceUrl = this.resolveRelativeUrls(url);
		const normalizedCompiledFileUrl = normalizedSourceUrl.replace(/\.\w+$/, (ext) => sourceExtensionsMap[ext] || ext);
		if (normalizedCompiledFileUrl !== normalizedSourceUrl && this.fs.fileExists(normalizedCompiledFileUrl)) {
			return normalizedCompiledFileUrl;
		}
		if (this.fs.fileExists(normalizedSourceUrl)) {
			return normalizedSourceUrl;
		}

		if (normalizedCompiledFileUrl === normalizedSourceUrl) {
			throw new Error(`Could not resolve ${url}. Looked for: ${normalizedSourceUrl}.`);
		} else {
			throw new Error(`Could not resolve ${url}.` + `Looked for: ${normalizedCompiledFileUrl}, ${normalizedSourceUrl}.`);
		}
	}

	private resolveRelativeUrls(url: string): string {
		// Angular assembles absolute URLs and prefixes them with //
		if (url.indexOf('/') !== 0) {
			// Resolve relative URLs based on the app root.
			return path.join(this.fs.currentApp().path, url);
		} else {
			return url;
		}
	}
}
