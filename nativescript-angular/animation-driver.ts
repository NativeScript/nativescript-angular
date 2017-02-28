import { AnimationPlayer, ɵAnimationStyles, ɵAnimationKeyframe  } from "@angular/core";
import { NativeScriptAnimationPlayer } from "./animation-player";
import { View } from "tns-core-modules/ui/core/view";

export abstract class AnimationDriver {
    abstract animate(
        element: any, startingStyles: ɵAnimationStyles, keyframes: ɵAnimationKeyframe[],
        duration: number, delay: number, easing: string): AnimationPlayer;
}

export class NativeScriptAnimationDriver implements AnimationDriver {

    computeStyle(element: any, prop: string): string {
        const view = <View>element;
        return view.style[`css-${prop}`];
    }

    animate(
        element: any,
        _startingStyles: ɵAnimationStyles,
        keyframes: ɵAnimationKeyframe[],
        duration: number,
        delay: number,
        easing: string
    ): AnimationPlayer {
        return new NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    }
}
