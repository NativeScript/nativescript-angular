import 'globals';
import "./zone.js/dist/zone-nativescript";

import 'reflect-metadata';
import './polyfills/array';
import './polyfills/console';

import { CommonModule } from '@angular/common';
import { NativeScriptRootRenderer, NativeScriptRenderer } from './renderer';
import { DetachedLoader } from "./common/detached-loader";
import { ModalDialogHost, ModalDialogService } from "./directives/dialogs";
import {
    ApplicationModule,
    ErrorHandler,
    Renderer,
    RootRenderer,
    Sanitizer,
    NgModule
} from '@angular/core';
import {
    defaultPageProvider, defaultFrameProvider, defaultDeviceProvider
} from "./platform-providers";
import { NativeScriptSanitizer } from './dom-adapter';
import { NS_DIRECTIVES } from './directives';

import * as nativescriptIntl from "nativescript-intl";
global.Intl = nativescriptIntl;

export interface AppOptions {
    bootInExistingPage: boolean,
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}

export const errorHandlerFactory = () => {
    return new ErrorHandler(true);
};

@NgModule({
    declarations: [
        DetachedLoader,
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ],
    providers: [
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        defaultFrameProvider,
        defaultPageProvider,
        defaultDeviceProvider,
        NativeScriptRootRenderer,
        { provide: RootRenderer, useClass: NativeScriptRootRenderer },
        NativeScriptRenderer,
        { provide: Renderer, useClass: NativeScriptRenderer },
        { provide: Sanitizer, useClass: NativeScriptSanitizer },
        ModalDialogService
    ],
    entryComponents: [
        DetachedLoader,
    ],
    imports: [
        CommonModule,
        ApplicationModule,
    ],
    exports: [
        CommonModule,
        ApplicationModule,
        DetachedLoader,
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ]
})
export class NativeScriptModule {
}
