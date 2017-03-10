import {
    Injectable,
    Compiler,
    NgModuleFactory,
    NgModuleFactoryLoader,
    SystemJsNgModuleLoader,
} from "@angular/core";

import { path, knownFolders } from "tns-core-modules/file-system";

const SEPARATOR = "#";

@Injectable()
export class NSModuleFactoryLoader implements NgModuleFactoryLoader {
    private offlineMode: boolean;

    constructor(private compiler: Compiler, private ngModuleLoader: SystemJsNgModuleLoader) {
        this.offlineMode = compiler instanceof Compiler;
    }

    load(path: string): Promise<NgModuleFactory<any>> {
        if (this.offlineMode) {
            return this.ngModuleLoader.load(path);
        } else {
            return this.loadAndCompile(path);
        }
    }

    private loadAndCompile(path: string): Promise<NgModuleFactory<any>> {
        let {modulePath, exportName} = splitPath(path);

        let loadedModule = global.require(modulePath)[exportName];
        checkNotEmpty(loadedModule, modulePath, exportName);

        return Promise.resolve(this.compiler.compileModuleAsync(loadedModule));
    }

}

function splitPath(path: string): {modulePath: string, exportName: string} {
    let [modulePath, exportName] = path.split(SEPARATOR);
    modulePath = getAbsolutePath(modulePath);

    if (typeof exportName === "undefined") {
        exportName = "default";
    }

    return {modulePath, exportName};
}

function getAbsolutePath(relativePath: string) {
    return path.normalize(path.join(knownFolders.currentApp().path, relativePath));
}

function checkNotEmpty(value: any, modulePath: string, exportName: string): any {
    if (!value) {
        throw new Error(`Cannot find '${exportName}' in '${modulePath}'`);
    }

    return value;
}
