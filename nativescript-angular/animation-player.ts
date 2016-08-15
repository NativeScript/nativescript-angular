import { AnimationKeyframe } from '@angular/core/src/animation/animation_keyframe';
import { AnimationPlayer } from '@angular/core/src/animation/animation_player';
import { KeyframeAnimation, KeyframeAnimationInfo, KeyframeInfo, KeyframeDeclaration } from 'ui/animation/keyframe-animation';
import { View } from "ui/core/view";
import enums = require("ui/enums");
import styleProperty = require('ui/styling/style-property');
import observable = require('ui/core/dependency-observable');
import types = require("utils/types");

export class NativeScriptAnimationPlayer implements AnimationPlayer {

    public parentPlayer: AnimationPlayer;

    private _subscriptions: Function[] = [];
    private _finished = false;
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
        keyframeAnimationInfo.curve = easing ? NativeScriptAnimationPlayer.animationTimingFunctionConverter(easing) : enums.AnimationCurve.ease;
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

        this.animation = KeyframeAnimation.keyframeAnimationFromInfo(keyframeAnimationInfo, observable.ValueSource.VisualState);
    }

    init(): void {
        throw new Error("Not implemented.");
    }

    hasStarted(): boolean {
        throw new Error("Not implemented.");
    }


    onDone(fn: Function): void { this._subscriptions.push(fn); }

    private _onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._subscriptions.forEach(fn => fn());
            this._subscriptions = [];
        }
    }

    play(): void {
        if (this.animation) {
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
                return enums.AnimationCurve.ease;
            case "linear":
                return enums.AnimationCurve.linear;
            case "ease-in":
                return enums.AnimationCurve.easeIn;
            case "ease-out":
                return enums.AnimationCurve.easeOut;
            case "ease-in-out":
                return enums.AnimationCurve.easeInOut;
            case "spring":
                return enums.AnimationCurve.spring;
            default:
                if (value.indexOf("cubic-bezier(") === 0) {
                    let bezierArr = value.substring(13).split(/[,]+/);
                    if (bezierArr.length !== 4) {
                        throw new Error("Invalid value for animation: " + value);
                    }
                    return enums.AnimationCurve.cubicBezier(
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
        else if (types.isString(value)) {
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
