// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {NavigationMainPageRouter, MainRouterProviders} from "./main/main-page-router-outlet"

// main-page-router-outlet
nativeScriptBootstrap(NavigationMainPageRouter, [MainRouterProviders]);