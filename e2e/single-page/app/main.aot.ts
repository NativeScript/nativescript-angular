import { platformNativeScript } from "@nativescript/angular/platform-static";
import { AppModuleNgFactory } from "./app.module.ngfactory";

platformNativeScript({ createFrameOnBootstrap: true }).bootstrapModuleFactory(AppModuleNgFactory);
