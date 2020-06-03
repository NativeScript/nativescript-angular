import {
    NgModule,
    NO_ERRORS_SCHEMA,
    NgModuleFactoryLoader
} from "@angular/core";

import { NativeScriptModule } from "@nativescript/angular";
import { NativeScriptAnimationsModule } from "@nativescript/angular/animations";
import { NSModuleFactoryLoader } from "@nativescript/angular/router";

import { AppRoutingModule } from "./app.routing";
import { AnimationsListComponent } from "./animations-list.component";
import { AnimationBuilderComponent } from "./animation-builder.component";
import { ExternalAnimationComponent } from "./external-animation.component";
import { FadeInOutComponent } from "./fade-in-out.component";
import { OptionsComponent } from "./options.component";
import { OptionsDefaultComponent } from "./options-default.component";
import { AnimateChildComponent } from "./animate-child.component";
import { SelectorAllComponent } from "./selector-all.component";
import { QueryStaggerComponent } from "./query-stagger.component";

import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    declarations: [
        AppComponent,
        AnimationsListComponent,
        AnimationBuilderComponent,
        ExternalAnimationComponent,
        FadeInOutComponent,
        OptionsComponent,
        OptionsDefaultComponent,
        AnimateChildComponent,
        SelectorAllComponent,
        QueryStaggerComponent,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptAnimationsModule,
        AppRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
