import { platformNativeScriptDynamic } from "@nativescript/angular";

import { AppModule } from "./app.module";
import { Trace } from "@nativescript/core";

Trace.enable();

platformNativeScriptDynamic().bootstrapModule(AppModule);
