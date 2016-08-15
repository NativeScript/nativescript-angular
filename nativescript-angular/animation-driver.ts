import { AnimationKeyframe } from '@angular/core/src/animation/animation_keyframe';
import { AnimationPlayer } from '@angular/core/src/animation/animation_player';
import { AnimationStyles } from '@angular/core/src/animation/animation_styles';
import { AnimationDriver } from '@angular/platform-browser/src/dom/animation_driver';
import { NativeScriptAnimationPlayer } from './animation-player';
import {View} from "ui/core/view";
import styleProperty = require('ui/styling/style-property');

export class NativeScriptAnimationDriver implements AnimationDriver {

    computeStyle(element: any, prop: string): string {
        return (<View>element).style._getValue(styleProperty.getPropertyByCssName(prop));
    }

    animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string): AnimationPlayer {
        return new NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    }
}
