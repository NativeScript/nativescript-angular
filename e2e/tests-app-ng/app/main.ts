import { platformNativeScriptDynamic } from "@nativescript/angular/platform";

import { AppModule } from "./app.module";
import { enable } from "@nativescript/core/trace";

enable();

platformNativeScriptDynamic().bootstrapModule(AppModule);
