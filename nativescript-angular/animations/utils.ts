import {
    KeyframeAnimation,
    KeyframeAnimationInfo,
    KeyframeDeclaration,
    KeyframeInfo,
} from "tns-core-modules/ui/animation/keyframe-animation";
import { parseKeyframeDeclarations } from "tns-core-modules/ui/styling/css-animation-parser";
import { animationTimingFunctionConverter } from "tns-core-modules/ui/styling/converters";

export interface Keyframe {
    [key: string]: string | number;
    offset: number;
}

const DASH_CASE_REGEXP = /-+([a-z0-9])/g;
export function dashCaseToCamelCase(input: string): string {
  return input.replace(DASH_CASE_REGEXP, (...m: any[]) => m[1].toUpperCase());
}

export function createKeyframeAnimation(
    styles: Keyframe[],
    duration: number,
    delay: number,
    easing: string)
    : KeyframeAnimation {

    const info = createKeyframeAnimationInfo(styles, duration, delay, easing);
    return KeyframeAnimation.keyframeAnimationFromInfo(info);
}

const createKeyframeAnimationInfo = (
    styles: Keyframe[],
    duration: number,
    delay: number,
    easing: string
    ): KeyframeAnimationInfo => ({
        isForwards: true,
        duration: duration || 0.01,
        delay,
        curve: getCurve(easing),
        keyframes: styles.map(parseAnimationKeyframe),
    }
);

const getCurve = (value: string) => animationTimingFunctionConverter(value);

const parseAnimationKeyframe = (styles: Keyframe): KeyframeInfo => ({
    duration: getKeyframeDuration(styles),
    declarations: getDeclarations(styles),
});

const getKeyframeDuration = (styles: Keyframe): number => styles.offset;

function getDeclarations(styles: Keyframe): KeyframeDeclaration[] {
    const unparsedDeclarations: KeyframeDeclaration[] =
        Object.keys(styles).map(property => ({ property, value: styles[property] }));

    return parseKeyframeDeclarations(unparsedDeclarations);
}
