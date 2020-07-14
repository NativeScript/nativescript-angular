import { platformNativeScript } from "@nativescript/angular";

import { AppModule } from "./app.module";
import { Trace } from "@nativescript/core";

Trace.enable();

platformNativeScript().bootstrapModule(AppModule);
