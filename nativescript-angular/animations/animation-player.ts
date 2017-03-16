import { AnimationPlayer } from "@angular/animations";
import {
    KeyframeAnimation,
    KeyframeAnimationInfo,
    KeyframeInfo,
    KeyframeDeclaration
} from "tns-core-modules/ui/animation/keyframe-animation";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { isString } from "tns-core-modules/utils/types";
import { CssAnimationProperty } from "tns-core-modules/ui/core/properties";

export class NativeScriptAnimationPlayer implements AnimationPlayer {

    public parentPlayer: AnimationPlayer = null;

    private _startSubscriptions: Function[] = [];
    private _doneSubscriptions: Function[] = [];
    private _finished = false;
    private _started = false;
    private animation: KeyframeAnimation;
    private target: View;

    constructor(
        element: Node,
        keyframes: {[key: string]: string | number}[],
        duration: number,
        delay: number,
        easing: string
    ) {
        if (!(element instanceof View)) {
            throw new Error("NativeScript: Can animate only Views!");
        }

        if (duration === 0) {
            duration = 0.01;
        }

        this.target = <any>element;

        let keyframeAnimationInfo = new KeyframeAnimationInfo();
        keyframeAnimationInfo.duration = duration;
        keyframeAnimationInfo.delay = delay;
        keyframeAnimationInfo.iterations = 1;
        keyframeAnimationInfo.curve = easing ?
            animationTimingFunctionConverter(easing) :
            AnimationCurve.ease;
        keyframeAnimationInfo.keyframes = new Array<KeyframeInfo>();
        keyframeAnimationInfo.isForwards = true;

        keyframeAnimationInfo.keyframes = keyframes.map(styles => {
            let keyframeInfo = <KeyframeInfo>{};
            keyframeInfo.duration = <number>styles.offset;
            keyframeInfo.declarations = Object.keys(styles).reduce((declarations, prop) => {
                let value = styles[prop];

                const property = CssAnimationProperty._getByCssName(prop);
                if (property) {
                    if (typeof value === "string" && property._valueConverter) {
                        value = property._valueConverter(<string>value);
                    }
                    declarations.push({ property: property.name, value });
                } else if (typeof value === "string" && prop === "transform") {
                    declarations.push(parseTransform(<string>value));
                }


                return declarations;
            }, new Array<KeyframeDeclaration>());

            return keyframeInfo;
        });

        keyframeAnimationInfo.keyframes = keyframes.map(styles => {
            let keyframeInfo = <KeyframeInfo>{};
            keyframeInfo.duration = <number>styles.offset;
            keyframeInfo.declarations = Object.keys(styles).map((prop, _index) => {
                let value = styles[prop];

                const property = CssAnimationProperty._getByCssName(prop);
                if (property) {
                    if (typeof value === "string" && property._valueConverter) {
                        value = property._valueConverter(<string>value);
                    }
                    return { property: property.name, value: value };
                } else if (typeof value === "string" && prop === "transform") {
                    return parseTransform(<string>value);
                }
            }).filter(declaration => !!declaration);

            return keyframeInfo;
        });

        this.animation = KeyframeAnimation.keyframeAnimationFromInfo(keyframeAnimationInfo);
    }

    init(): void {
    }

    hasStarted(): boolean {
        return this._started;
    }

    onStart(fn: Function): void { this._startSubscriptions.push(fn); }
    onDone(fn: Function): void { this._doneSubscriptions.push(fn); }
    onDestroy(fn: Function): void { this._doneSubscriptions.push(fn); }

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
                .catch((_e) => { });
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

    setPosition(_p: any): void {
        throw new Error("AnimationPlayer.setPosition method is not supported!");
    }

    getPosition(): number {
        return 0;
    }

}

function parseTransform(value: string): KeyframeDeclaration {
    let newTransform = transformConverter(value);
    let values = undefined;
    for (let transform in newTransform) {
        switch (transform) {
            case "scaleX":
                return {
                    property: "scale",
                    value: { x: parseFloat(newTransform[transform]), y: 1 }
                };
            case "scaleY":
                return {
                    property: "scale",
                    value: { x: 1, y: parseFloat(newTransform[transform]) }
                };
            case "scale":
            case "scale3d":
                values = newTransform[transform].split(",");
                if (values.length === 2 || values.length === 3) {
                    return {
                        property: "scale",
                        value: { x: parseFloat(values[0]), y: parseFloat(values[1]) }
                    };
                }
                break;
            case "translateX":
                return {
                    property: "translate",
                    value: { x: parseFloat(newTransform[transform]), y: 0 }
                };
            case "translateY":
                return {
                    property: "translate",
                    value: { x: 0, y: parseFloat(newTransform[transform]) }
                };
            case "translate":
            case "translate3d":
                values = newTransform[transform].split(",");
                if (values.length === 2 || values.length === 3) {
                    return {
                        property: "translate",
                        value: {
                            x: parseFloat(values[0]),
                            y: parseFloat(values[1])
                        }
                    };
                }
                break;
            case "rotate":
                let text = newTransform[transform];
                let val = parseFloat(text);
                if (text.slice(-3) === "rad") {
                    val = val * (180.0 / Math.PI);
                }

                return { property: "rotate", value: val };
            // case "none":
            //     return [
            //         { property: "scale", value: { x: 1, y: 1 } },
            //         { property: "translate", value: { x: 0, y: 0 } },
            //         { property: "rotate", value: 0 },
            //     ];
            default:
                throw new Error("Unsupported transform: " + transform);
        }
    }
}

function transformConverter(value: any): Object {
    if (value === "none") {
        let operations = {};
        operations[value] = value;
        return operations;
    } else if (isString(value)) {
        let operations = {};
        let operator = "";
        let pos = 0;
        while (pos < value.length) {
            if (value[pos] === " " || value[pos] === ",") {
                pos++;
            } else if (value[pos] === "(") {
                let start = pos + 1;
                while (pos < value.length && value[pos] !== ")") {
                    pos++;
                }
                let operand = value.substring(start, pos);
                operations[operator] = operand.trim();
                operator = "";
                pos++;
            } else {
                operator += value[pos++];
            }
        }
        return operations;
    } else {
        return undefined;
    }
}


function animationTimingFunctionConverter(value): any {
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
                    bezieArgumentConverter(bezierArr[0]),
                    bezieArgumentConverter(bezierArr[1]),
                    bezieArgumentConverter(bezierArr[2]),
                    bezieArgumentConverter(bezierArr[3]));
            } else {
                throw new Error("Invalid value for animation: " + value);
            }
    }
}


function bezieArgumentConverter(value): number {
    let result = parseFloat(value);
    result = Math.max(0.0, result);
    result = Math.min(1.0, result);
    return result;
}

