import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from './home/home.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            animation: 'homePage'
        },
    },
    {
        path: 'support',
        component: SupportComponent,
        data: {
            animation: 'supportPage'
        }
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
