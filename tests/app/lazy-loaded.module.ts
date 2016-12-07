import { NgModule } from '@angular/core';
import { NativeScriptModule, NativeScriptRouterModule } from "nativescript-angular";

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

