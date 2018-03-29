import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app.module";

platformNativeScriptDynamic({ createFrameOnBootstrap: true }).bootstrapModule(AppModule);
