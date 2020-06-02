import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular/common";

import { HeroRoutingModule, routedComponents } from "./hero-routing.module";

import { HeroListBasicComponent } from './hero-list-basic.component';
import { HeroListInlineStylesComponent } from './hero-list-inline-styles.component';
import { HeroListEnterLeaveComponent } from './hero-list-enter-leave.component';
import { HeroListEnterLeaveStatesComponent } from './hero-list-enter-leave-states.component';
import { HeroListCombinedTransitionsComponent } from './hero-list-combined-transitions.component';
import { HeroListTwowayComponent } from './hero-list-twoway.component';
import { HeroListTimingsComponent } from './hero-list-timings.component';

@NgModule({
    declarations: [
        ...routedComponents,
        HeroListBasicComponent,
        HeroListInlineStylesComponent,
        HeroListEnterLeaveComponent,
        HeroListEnterLeaveStatesComponent,
        HeroListCombinedTransitionsComponent,
        HeroListTwowayComponent,
        HeroListTimingsComponent,
    ],
    imports: [
        NativeScriptCommonModule,
        HeroRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HeroModule { }
