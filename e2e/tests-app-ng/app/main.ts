import { platformNativeScript } from "@nativescript/angular";

import { AppModule } from "./app.module";
import { enable } from "@nativescript/core/trace";

enable();

platformNativeScript().bootstrapModule(AppModule);
