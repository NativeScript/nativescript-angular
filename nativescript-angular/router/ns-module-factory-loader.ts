import {
    Injectable,
    Compiler,
    NgModuleFactory,
    NgModuleFactoryLoader,
    ModuleWithComponentFactories,
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

    /**
     * When needing the module with component factories
     * Example: lazy loading on demand via user actions instead of routing
     * Provides access to components in the lazy loaded module right away
     * @param path module path
     */
    public loadAndCompileComponents(path: string): Promise<any> {
        return this.loadAndCompile(path, true);
    }

    private loadAndCompile(path: string, includeComponents?: boolean): Promise<NgModuleFactory<any> | ModuleWithComponentFactories<any>> {
        let {modulePath, exportName} = splitPath(path);

        let loadedModule = global.require(modulePath)[exportName];
        checkNotEmpty(loadedModule, modulePath, exportName);

        if (includeComponents) {
            return Promise.resolve(this.compiler.compileModuleAndAllComponentsAsync(loadedModule));
        } else {
            return Promise.resolve(this.compiler.compileModuleAsync(loadedModule));
        }      
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
