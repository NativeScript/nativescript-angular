import {
    Injectable,
    Compiler,
    NgModuleFactory,
    NgModuleFactoryLoader
} from "@angular/core";

import { path, knownFolders } from "file-system";

declare var System: any;
const SEPARATOR = "#";
const FACTORY_CLASS_SUFFIX = "NgFactory";
const FACTORY_PATH_SUFFIX = ".ngfactory";

@Injectable()
export class NSModuleFactoryLoader implements NgModuleFactoryLoader {
    private offlineMode: boolean;

    constructor(private compiler: Compiler) {
        this.offlineMode = compiler instanceof Compiler;
    }

    load(path: string): Promise<NgModuleFactory<any>> {
        let {modulePath, exportName} = this.splitPath(path);

        if (this.offlineMode) {
            return this.loadFactory(modulePath, exportName);
        } else {
            return this.loadAndCompile(modulePath, exportName);
        }
    }

    private loadFactory(modulePath: string, exportName: string): Promise<NgModuleFactory<any>> {
        modulePath = factoryModulePath(modulePath);
        exportName = factoryExportName(exportName);

        return System.import(modulePath)
            .then((module: any) => module[exportName])
            .then((factory: any) => checkNotEmpty(factory, modulePath, exportName));
    }

    private loadAndCompile(modulePath: string, exportName: string): Promise<NgModuleFactory<any>> {
        modulePath = getAbsolutePath(modulePath);

        let loadedModule = require(modulePath)[exportName];
        checkNotEmpty(loadedModule, modulePath, exportName);

        return Promise.resolve(this.compiler.compileModuleAsync(loadedModule));
    }

    private splitPath(path: string): {modulePath: string, exportName: string} {
        let [modulePath, exportName] = path.split(SEPARATOR);

        if (typeof exportName === "undefined") {
            exportName = "default";
        }

        return {modulePath, exportName};
    }
}

function getAbsolutePath(relativePath: string) {
    return path.normalize(path.join(knownFolders.currentApp().path, relativePath));
}

function factoryModulePath(modulePath) {
    return `${modulePath}${FACTORY_PATH_SUFFIX}`;
}

function factoryExportName(exportName) {
    return exportName === "default" ?
        exportName :
        `${exportName}${FACTORY_CLASS_SUFFIX}`;
}

function checkNotEmpty(value: any, modulePath: string, exportName: string): any {
    if (!value) {
        throw new Error(`Cannot find '${exportName}' in '${modulePath}'`);
    }

    return value;
}
