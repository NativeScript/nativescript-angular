import {
    Compiler,
    Injectable,
    NgModuleFactory,
    NgModuleFactoryLoader,
    SystemJsNgModuleLoader,
    Type,
} from "@angular/core";
import { path, knownFolders } from "tns-core-modules/file-system";

const SEPARATOR = "#";

@Injectable()
export class NSModuleFactoryLoader implements NgModuleFactoryLoader {
    private offlineMode: boolean;

    constructor(
        private compiler: Compiler,
        private ngModuleLoader: SystemJsNgModuleLoader,
    ) {
        this.offlineMode = compiler instanceof Compiler;
    }

    load(path: string): Promise<NgModuleFactory<any>> {
        return this.offlineMode ?
            this.ngModuleLoader.load(path) :
            this.loadAndCompile(path);
    }

    private loadAndCompile(path: string): Promise<NgModuleFactory<any>> {
        const module = requireModule(path);
        return Promise.resolve(this.compiler.compileModuleAsync(module));
    }
}

function requireModule(path: string): Type<any> {
    const {modulePath, exportName} = splitPath(path);

    const loadedModule = global.require(modulePath)[exportName];
    checkNotEmpty(loadedModule, modulePath, exportName);

    return loadedModule;
}

function splitPath(path: string): {modulePath: string, exportName: string} {
    const [relativeModulePath, exportName = "default"] = path.split(SEPARATOR);
    const absoluteModulePath = getAbsolutePath(relativeModulePath);

    return {modulePath: absoluteModulePath, exportName};
}

function getAbsolutePath(relativePath: string) {
    const projectPath = knownFolders.currentApp().path;
    const absolutePath = path.join(projectPath, relativePath);

    return path.normalize(absolutePath);
}

function checkNotEmpty(value: any, modulePath: string, exportName: string): void {
    if (!value) {
        throw new Error(`Cannot find '${exportName}' in '${modulePath}'`);
    }
}
