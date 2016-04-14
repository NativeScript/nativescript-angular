// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {GestureComponent} from "./snippets/gestures.component";
import {LayoutsComponent} from "./snippets/layouts.component";
import {IconFontComponent} from "./snippets/icon-font.component";

nativeScriptBootstrap(AppComponent);
// nativeScriptBootstrap(GestureComponent);
// nativeScriptBootstrap(LayoutsComponent);
// nativeScriptBootstrap(IconFontComponent);
