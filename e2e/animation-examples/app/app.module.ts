import {
    NgModule,
    NO_ERRORS_SCHEMA,
    NgModuleFactoryLoader,
    APP_INITIALIZER
} from "@angular/core";

import { NativeScriptModule, NativeScriptAnimationsModule } from "@nativescript/angular";

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

export function asyncBoot(): Function {
  return (): Promise<any> => new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 5000);
  })
}

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
    /**
     * Uncomment to test APP_INITIALIZER 
     */
    // providers: [
    //   {
    //     provide: APP_INITIALIZER,
    //     useFactory: asyncBoot,
    //     multi: true
    //   },
    // ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
