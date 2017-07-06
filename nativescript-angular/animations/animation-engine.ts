import {
    AnimationDriver,
    ɵAnimationEngine as AnimationEngine,
} from "@angular/animations/browser";
import {
    AnimationStyleNormalizer
} from "@angular/animations/browser/src/dsl/style_normalization/animation_style_normalizer";

import { NSTransitionAnimationEngine } from "./transition-animation-engine";

export class NativeScriptAnimationEngine extends AnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer) {
        super(driver, normalizer);
        (<any>this)._transitionEngine = new NSTransitionAnimationEngine(driver, normalizer);
    }
}
