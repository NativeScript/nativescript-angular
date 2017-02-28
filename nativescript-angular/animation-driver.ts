import { AnimationPlayer, ɵAnimationStyles, ɵAnimationKeyframe  } from "@angular/core";
import { NativeScriptAnimationPlayer } from "./animation-player";
import { View } from "ui/core/view";
import { getPropertyByCssName } from "ui/styling/style-property";

export abstract class AnimationDriver {
    abstract animate(
        element: any, startingStyles: ɵAnimationStyles, keyframes: ɵAnimationKeyframe[],
        duration: number, delay: number, easing: string): AnimationPlayer;
}

export class NativeScriptAnimationDriver implements AnimationDriver {

    computeStyle(element: any, prop: string): string {
        return (<View>element).style._getValue(getPropertyByCssName(prop));
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
