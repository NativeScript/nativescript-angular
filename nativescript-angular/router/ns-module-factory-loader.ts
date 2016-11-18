import {
    Injectable,
    Compiler,
    NgModuleFactory,
    NgModuleFactoryLoader
} from "@angular/core";

import * as fs from "file-system";

const SEPARATOR = "#";
const FACTORY_CLASS_SUFFIX = "NgFactory";
const FACTORY_PATH_SUFFIX = ".ngfactory";

@Injectable()
export class NsModuleFactoryLoader implements NgModuleFactoryLoader {
    private offlineMode: boolean;

    constructor(private compiler: Compiler) {
        this.offlineMode = compiler instanceof Compiler;
    }

    load(path: string): Promise<NgModuleFactory<any>> {
        let [modulePath, exportName] = path.split(SEPARATOR);

        if (typeof exportName === "undefined") {
            exportName = "default";
        }

        if (this.offlineMode) {
            modulePath = factoryModulePath(modulePath);
            exportName = factoryExportName(exportName);
        }
        else {
            modulePath = fs.path.normalize(fs.path.join(fs.knownFolders.currentApp().path, modulePath));
        }

        let loadedModule = require(modulePath)[exportName];
        if (!loadedModule) {
            throw new Error(`Cannot find "${exportName}" in "${modulePath}"`);
        }

        return this.offlineMode ? Promise.resolve(loadedModule) : this.compiler.compileModuleAsync(loadedModule);
    }
}

function factoryModulePath(modulePath) {
    return `${modulePath}${FACTORY_PATH_SUFFIX}`;
}

function factoryExportName(exportName) {
    return exportName === "default" ? exportName : `${exportName}${FACTORY_CLASS_SUFFIX}`;
}