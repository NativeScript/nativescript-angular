import { AnimationPlayer } from "@angular/core";
import { AnimationKeyframe } from "./private_import_core";
import { KeyframeAnimation, KeyframeAnimationInfo, KeyframeInfo, KeyframeDeclaration } from 'ui/animation/keyframe-animation';
import { View } from "ui/core/view";
import { AnimationCurve } from "ui/enums";
import { ValueSource } from 'ui/core/dependency-observable';
import { isString } from "utils/types";
import * as styleProperty from 'ui/styling/style-property';

export class NativeScriptAnimationPlayer implements AnimationPlayer {

    public parentPlayer: AnimationPlayer;

    private _startSubscriptions: Function[] = [];
    private _doneSubscriptions: Function[] = [];
    private _finished = false;
    private _started = false;
    private animation: KeyframeAnimation;
    private target: View;

    constructor(element: Node, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string) {

        this.parentPlayer = null;

        if (duration === 0) {
            duration = 0.01;
        }

        if (!(element instanceof View)) {
            throw new Error("NativeScript: Can animate only Views!");
        }

        this.target = <any>element;

        let keyframeAnimationInfo = new KeyframeAnimationInfo();
        keyframeAnimationInfo.duration = duration;
        keyframeAnimationInfo.delay = delay;
        keyframeAnimationInfo.iterations = 1;
        keyframeAnimationInfo.curve = easing ? NativeScriptAnimationPlayer.animationTimingFunctionConverter(easing) : AnimationCurve.ease;
        keyframeAnimationInfo.keyframes = new Array<KeyframeInfo>();
        keyframeAnimationInfo.isForwards = true;

        for (let keyframe of keyframes) {
            let keyframeInfo = <KeyframeInfo>{};
            keyframeInfo.duration = keyframe.offset;
            keyframeInfo.declarations = new Array<KeyframeDeclaration>();
            for (let style of keyframe.styles.styles) {
                for (let substyle in style) {
                    let value = style[substyle];
                    let property = styleProperty.getPropertyByCssName(substyle);
                    if (property) {
                        if (typeof value === "string" && property.valueConverter) {
                            value = property.valueConverter(<string>value);
                        }
                        keyframeInfo.declarations.push({ property: property.name, value: value });
                    }
                    else if (typeof value === "string" && substyle === "transform") {
                        NativeScriptAnimationPlayer.parseTransform(<string>value, keyframeInfo);
                    }
                }
            }
            keyframeAnimationInfo.keyframes.push(keyframeInfo);
        }

        this.animation = KeyframeAnimation.keyframeAnimationFromInfo(keyframeAnimationInfo, ValueSource.VisualState);
    }

    init(): void {
    }

    hasStarted(): boolean {
        return this._started;
    }


    onStart(fn: Function): void { this._startSubscriptions.push(fn); }
    onDone(fn: Function): void { this._doneSubscriptions.push(fn); }

    private _onStart() {
        if (!this._started) {
            this._started = true;
            this._startSubscriptions.forEach(fn => fn());
            this._startSubscriptions = [];
        }
    }

    private _onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._started = false;
            this._doneSubscriptions.forEach(fn => fn());
            this._doneSubscriptions = [];
        }
    }

    play(): void {
        if (this.animation) {
            this._onStart();
            this.animation.play(this.target)
                .then(() => { this._onFinish(); })
                .catch((e) => { });
        }
    }

    pause(): void {
        throw new Error("AnimationPlayer.pause method is not supported!");
    }

    finish(): void {
        throw new Error("AnimationPlayer.finish method is not supported!");
    }

    reset(): void {
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
    }

    restart(): void {
        this.reset();
        this.play();
    }

    destroy(): void {
        this.reset();
        this._onFinish();
    }

    setPosition(p: any): void {
        throw new Error("AnimationPlayer.setPosition method is not supported!");
    }

    getPosition(): number {
        return 0;
    }

    static animationTimingFunctionConverter(value): any {
        switch (value) {
            case "ease":
                return AnimationCurve.ease;
            case "linear":
                return AnimationCurve.linear;
            case "ease-in":
                return AnimationCurve.easeIn;
            case "ease-out":
                return AnimationCurve.easeOut;
            case "ease-in-out":
                return AnimationCurve.easeInOut;
            case "spring":
                return AnimationCurve.spring;
            default:
                if (value.indexOf("cubic-bezier(") === 0) {
                    let bezierArr = value.substring(13).split(/[,]+/);
                    if (bezierArr.length !== 4) {
                        throw new Error("Invalid value for animation: " + value);
                    }
                    return AnimationCurve.cubicBezier(
                        NativeScriptAnimationPlayer.bezieArgumentConverter(bezierArr[0]),
                        NativeScriptAnimationPlayer.bezieArgumentConverter(bezierArr[1]),
                        NativeScriptAnimationPlayer.bezieArgumentConverter(bezierArr[2]),
                        NativeScriptAnimationPlayer.bezieArgumentConverter(bezierArr[3]));
                }
                else {
                    throw new Error("Invalid value for animation: " + value);
                }
        }
    }

    static bezieArgumentConverter(value): number {
        let result = parseFloat(value);
        result = Math.max(0.0, result);
        result = Math.min(1.0, result);
        return result;
    }

    static transformConverter(value: any): Object {
        if (value === "none") {
            let operations = {};
            operations[value] = value;
            return operations;
        }
        else if (isString(value)) {
            let operations = {};
            let operator = "";
            let pos = 0;
            while (pos < value.length) {
                if (value[pos] === " " || value[pos] === ",") {
                    pos++;
                }
                else if (value[pos] === "(") {
                    let start = pos + 1;
                    while (pos < value.length && value[pos] !== ")") {
                        pos++;
                    }
                    let operand = value.substring(start, pos);
                    operations[operator] = operand.trim();
                    operator = "";
                    pos++;
                }
                else {
                    operator += value[pos++];
                }
            }
            return operations;
        }
        else {
            return undefined;
        }
    }

    static parseTransform(value: string, animationInfo: KeyframeInfo) {
        let newTransform = NativeScriptAnimationPlayer.transformConverter(value);
        let array = new Array<styleProperty.KeyValuePair<styleProperty.Property, any>>();
        let values = undefined;
        for (let transform in newTransform) {
            switch (transform) {
                case "scaleX":
                    animationInfo.declarations.push({ property: "scale", value: { x: parseFloat(newTransform[transform]), y: 1 } });
                    break;
                case "scaleY":
                    animationInfo.declarations.push({ property: "scale", value: { x: 1, y: parseFloat(newTransform[transform]) } });
                    break;
                case "scale":
                case "scale3d":
                    values = newTransform[transform].split(",");
                    if (values.length === 2 || values.length === 3) {
                        animationInfo.declarations.push({ property: "scale", value: { x: parseFloat(values[0]), y: parseFloat(values[1]) } });
                    }
                    break;
                case "translateX":
                    animationInfo.declarations.push({ property: "translate", value: { x: parseFloat(newTransform[transform]), y: 0 } });
                    break;
                case "translateY":
                    animationInfo.declarations.push({ property: "translate", value: { x: 0, y: parseFloat(newTransform[transform]) } });
                    break;
                case "translate":
                case "translate3d":
                    values = newTransform[transform].split(",");
                    if (values.length === 2 || values.length === 3) {
                        animationInfo.declarations.push({ property: "translate", value: { x: parseFloat(values[0]), y: parseFloat(values[1]) } });
                    }
                    break;
                case "rotate":
                    let text = newTransform[transform];
                    let val = parseFloat(text);
                    if (text.slice(-3) === "rad") {
                        val = val * (180.0 / Math.PI);
                    }
                    animationInfo.declarations.push({ property: "rotate", value: val });
                    break;
                case "none":
                    animationInfo.declarations.push({ property: "scale", value: { x: 1, y: 1 } });
                    animationInfo.declarations.push({ property: "translate", value: { x: 0, y: 0 } });
                    animationInfo.declarations.push({ property: "rotate", value: 0 });
                    break;
            }
        }
        return array;
    }
}
