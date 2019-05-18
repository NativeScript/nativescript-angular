import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { animationsTraceCategory } from "nativescript-angular/trace";
import { setCategories, enable } from "trace";

import { AppModule } from "./app.module";

setCategories(animationsTraceCategory);
enable();

platformNativeScriptDynamic().bootstrapModule(AppModule);
