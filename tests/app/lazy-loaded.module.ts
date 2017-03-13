import { NgModule } from '@angular/core';
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { SecondComponent } from './second.component';

const routes = [
    { path: ":id", component: SecondComponent },
];

@NgModule({
    declarations: [SecondComponent],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes)
    ]
})
export class SecondModule { }

