import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { NativeScriptRouterModule } from "@nativescript/angular/router";
import { ModalDialogParams } from "@nativescript/angular/directives/dialogs";

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Routes } from "@angular/router";

import { LazyComponent } from "./lazy.component";

export function modalParamsFactory() {
    return new ModalDialogParams({}, null);
}

const routes: Routes = [
  {
    path: "",
    component: LazyComponent
  }
];

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild(routes),
  ],
  declarations: [
    LazyComponent
  ],
  entryComponents: [
    LazyComponent
  ],
  providers: [
    // allows same component to be routed to
    // or lazily loaded via modal
    { provide: ModalDialogParams, useFactory: modalParamsFactory }
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LazyModule { }
