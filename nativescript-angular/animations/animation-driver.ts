import { AnimationPlayer } from "@angular/animations";
import { View } from "tns-core-modules/ui/core/view";

import { NativeScriptAnimationPlayer } from "./animation-player";

export abstract class AnimationDriver {
    abstract animate(
        element: any,
        keyframes: {[key: string]: string | number}[],
        duration: number,
        delay: number,
        easing: string
    ): AnimationPlayer;
}

export class NativeScriptAnimationDriver implements AnimationDriver {
    computeStyle(element: any, prop: string): string {
        const view = <View>element;
        return view.style[`css-${prop}`];
    }

    animate(
        element: any,
        keyframes: {[key: string]: string | number}[],
        duration: number,
        delay: number,
        easing: string
    ): AnimationPlayer {
        return new NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    }
}
