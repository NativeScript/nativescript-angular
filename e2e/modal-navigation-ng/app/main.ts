// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "@nativescript/angular";
console.log(">>>>>>>>main.ts");

import { AppModule } from "./app.module";
import { NativeScriptPlatformRef } from "@nativescript/angular";

AppModule.platformRef = <NativeScriptPlatformRef>platformNativeScriptDynamic();
AppModule.platformRef.bootstrapModule(AppModule);