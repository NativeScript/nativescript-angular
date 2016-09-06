import {isBlank, isNumber} from "../lang-facade";

export function convertToInt(value): number {
    let normalizedValue;
        if (isBlank(value)) {
            normalizedValue = 0;
        } else {
            if (isNumber(value)) {
                normalizedValue = value;
            } else {
                let parsedValue = parseInt(value.toString());
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
    return Math.round(normalizedValue);
}
