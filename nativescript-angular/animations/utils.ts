import { KeyframeDeclaration, KeyframeInfo } from "ui/animation/keyframe-animation";
import { AnimationCurve } from "ui/enums";
import { getPropertyByCssName } from "ui/styling/style-property";

export interface Keyframe {
    [key: string]: string | number;
}

interface Transformation {
    property: string;
    value: number | { x: number, y: number };
}

const TRANSFORM_MATCHER = new RegExp(/(.+)\((.+)\)/);
const TRANSFORM_SPLITTER = new RegExp(/[\s,]+/);

const STYLE_TRANSFORMATION_MAP = Object.freeze({
    "scale": value => ({ property: "scale", value }),
    "scale3d": value => ({ property: "scale", value }),
    "scaleX": value => ({ property: "scale", value: { x: value, y: 1 } }),
    "scaleY": value => ({ property: "scale", value: { x: 1, y: value } }),

    "translate": value => ({ property: "translate", value }),
    "translate3d": value => ({ property: "translate", value }),
    "translateX": value => ({ property: "translate", value: { x: value, y: 0 } }),
    "translateY": value => ({ property: "translate", value: { x: 0, y: value } }),

    "rotate": value => ({ property: "rotate", value }),

    "none": _value => [
        { property: "scale", value: { x: 1, y: 1 } },
        { property: "translate", value: { x: 0, y: 0 } },
        { property: "rotate", value: 0 },
    ],
});

const STYLE_CURVE_MAP = Object.freeze({
    "ease": AnimationCurve.ease,
    "linear": AnimationCurve.linear,
    "ease-in": AnimationCurve.easeIn,
    "ease-out": AnimationCurve.easeOut,
    "ease-in-out": AnimationCurve.easeInOut,
    "spring": AnimationCurve.spring,
});

export function getAnimationCurve(value: string): any {
    if (!value) {
        return AnimationCurve.ease;
    }

    const curve = STYLE_CURVE_MAP[value];
    if (curve) {
        return curve;
    }

    const [, property = "", pointsString = ""] = TRANSFORM_MATCHER.exec(value) || [];
    const coords = pointsString.split(TRANSFORM_SPLITTER).map(stringToBezieCoords);

    if (property !== "cubic-bezier" || coords.length !== 4) {
        throw new Error(`Invalid value for animation: ${value}`);
    } else {
        return (<any>AnimationCurve).cubicBezier(...coords);
    }
}

export function parseAnimationKeyframe(styles: Keyframe) {
    let keyframeInfo = <KeyframeInfo>{};

    keyframeInfo.duration = <number>styles["offset"];
    keyframeInfo.declarations = Object.keys(styles).reduce((declarations, prop) => {
        let value = styles[prop];
        const kebapCaseProp = prop.split(/(?=[A-Z])/).join("-").toLowerCase();

        const property = getPropertyByCssName(kebapCaseProp);
        if (property) {
            if (typeof value === "string" && property.valueConverter) {
                value = property.valueConverter(<string>value);
            }
            declarations.push({ property: property.name, value });
        } else if (typeof value === "string" && prop === "transform") {
            declarations.push(...parseTransformation(<string>value));
        }

        return declarations;
    }, new Array<KeyframeDeclaration>());

    return keyframeInfo;
}

function stringToBezieCoords(value: string): number {
    let result = parseFloat(value);
    if (result < 0) {
        return 0;
    } else if (result > 1) {
        return 1;
    }

    return result;
}

function parseTransformation(styleString: string): KeyframeDeclaration[] {
    return parseStyle(styleString)
        .reduce((transformations, style) => {
            const transform = STYLE_TRANSFORMATION_MAP[style.property](style.value);

            if (Array.isArray(transform)) {
                transformations.push(...transform);
            } else if (typeof transform !== "undefined") {
                transformations.push(transform);
            }

            return transformations;
        }, new Array<Transformation>());
}

function parseStyle(text: string): Transformation[] {
    return text.split(TRANSFORM_SPLITTER).map(stringToTransformation).filter(t => !!t);
}

function stringToTransformation(text: string): Transformation {
    const [, property = "", stringValue = ""] = TRANSFORM_MATCHER.exec(text) || [];
    if (!property) {
        return;
    }

    const [x, y] = stringValue.split(",").map(parseFloat);
    if (x && y) {
        return { property, value: {x, y} };
    } else {
        let value: number = x;

        if (stringValue.slice(-3) === "rad") {
            value *= 180.0 / Math.PI;
        }

        return { property, value };
     }
}
