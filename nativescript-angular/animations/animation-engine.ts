import {
    AnimationDriver,
    ɵAnimationEngine as AnimationEngine,
    ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
} from "@angular/animations/browser";

import { NSTransitionAnimationEngine } from "./transition-animation-engine";

export class NativeScriptAnimationEngine extends AnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer) {
        super(driver, normalizer);

        (<any>this)._transitionEngine.onRemovalComplete = (element, delegate) => {
            const parent = delegate && delegate.parentNode(element);
            if (parent) {
                delegate.removeChild(parent, element);
            }
        };
    }
}
