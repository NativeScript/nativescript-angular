import {
    Compiler,
    Injectable,
    Optional,
    SystemJsNgModuleLoader,
    SystemJsNgModuleLoaderConfig,
} from "@angular/core";

@Injectable()
export class NSModuleFactoryLoader extends SystemJsNgModuleLoader {
    constructor(
        compiler: Compiler,
        @Optional() config?: SystemJsNgModuleLoaderConfig
    ) {
        super(compiler, config);
        console.log(`NSModuleFactoryLoader is deprecated! ` +
        `You no longer need to provide it as a module loader.`);
    }
}
