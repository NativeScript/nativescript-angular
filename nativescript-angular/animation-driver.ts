import { AnimationPlayer, AnimationStyles, AnimationKeyframe  } from "./private_import_core";
import { NativeScriptAnimationPlayer } from './animation-player';
import {View} from "ui/core/view";
import styleProperty = require('ui/styling/style-property');

export abstract class AnimationDriver {
    abstract animate(
        element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[],
        duration: number, delay: number, easing: string): AnimationPlayer;
}

export class NativeScriptAnimationDriver implements AnimationDriver {

    computeStyle(element: any, prop: string): string {
        return (<View>element).style._getValue(styleProperty.getPropertyByCssName(prop));
    }

    animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string): AnimationPlayer {
        return new NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    }
}
