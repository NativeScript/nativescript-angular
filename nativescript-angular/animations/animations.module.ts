import { NgModule, Injectable, NgZone, Provider, RendererFactory2 } from "@angular/core";

import { AnimationBuilder } from "@angular/animations";

import {
    AnimationDriver,
    ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
    ɵWebAnimationsStyleNormalizer as WebAnimationsStyleNormalizer,
    ɵAnimationEngine as AnimationEngine,
} from "@angular/animations/browser";

import {
    ɵAnimationRendererFactory as AnimationRendererFactory,
    ɵBrowserAnimationBuilder as BrowserAnimationBuilder,
} from "@angular/platform-browser/animations";

import { NativeScriptModule } from "../nativescript.module";
import { NativeScriptRendererFactory } from "../renderer";
import { NativeScriptAnimationDriver } from "./animation-driver";

(<any>global).document = {
    body: {
        isOverride: true,
    }
};

@Injectable()
export class InjectableAnimationEngine extends AnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer) {
        super(driver, normalizer);
    }
}

export function instantiateSupportedAnimationDriver() {
    return new NativeScriptAnimationDriver();
}

export function instantiateRendererFactory(
        renderer: NativeScriptRendererFactory, engine: AnimationEngine, zone: NgZone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}

export function instantiateDefaultStyleNormalizer() {
    return new WebAnimationsStyleNormalizer();
}

export const NATIVESCRIPT_ANIMATIONS_PROVIDERS: Provider[] = [
    {provide: AnimationBuilder, useClass: BrowserAnimationBuilder},
    {provide: AnimationDriver, useFactory: instantiateSupportedAnimationDriver},
    {provide: AnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer},
    {provide: AnimationEngine, useClass: InjectableAnimationEngine},
    {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [NativeScriptRendererFactory, AnimationEngine, NgZone]
    }
];

@NgModule({
    imports: [NativeScriptModule],
    providers: NATIVESCRIPT_ANIMATIONS_PROVIDERS,
})
export class NativeScriptAnimationsModule {
}
