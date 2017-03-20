import {
    AnimationEvent,
    AnimationPlayer,
    NoopAnimationPlayer,
    ɵAnimationGroupPlayer,
    ɵStyleData,
} from "@angular/animations";

import { isString } from "utils/types";
import { ValueSource } from "ui/core/dependency-observable";
import { StyleProperty, getPropertyByName, withStyleProperty } from "ui/styling/style-property";

import { NgView } from "../element-registry";
import { rendererLog as traceLog, styleError } from "../trace";

// overriden to use the default 'unsetValue'
// instead of empty string ''
export function eraseStylesOverride(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => setStyleProperty(element, prop, styles[prop]));
    }
}

export function cssClasses(element: NgView) {
    if (!element.ngCssClasses) {
        element.ngCssClasses = new Map<string, boolean>();
    }
    return element.ngCssClasses;
}

// The following functions are from
// the original DomAnimationEngine
export function getOrSetAsInMap(map: Map<any, any>, key: any, defaultValue: any) {
    let value = map.get(key);
    if (!value) {
        map.set(key, value = defaultValue);
    }
    return value;
}

export function deleteFromArrayMap(map: Map<any, any[]>, key: any, value: any) {
    let arr = map.get(key);
    if (arr) {
        const index = arr.indexOf(value);
        if (index >= 0) {
            arr.splice(index, 1);
            if (arr.length === 0) {
                map.delete(key);
            }
        }
    }
}

export function optimizeGroupPlayer(players: AnimationPlayer[]): AnimationPlayer {
    switch (players.length) {
        case 0:
            return new NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new ɵAnimationGroupPlayer(players);
    }
}

export function copyArray(source: any[]): any[] {
    return source ? source.splice(0) : [];
}

export function makeAnimationEvent(
        element: NgView, triggerName: string, fromState: string, toState: string, phaseName: string,
        totalTime: number): AnimationEvent {
    return <AnimationEvent>{element, triggerName, fromState, toState, phaseName, totalTime};
}

export function setStyles(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => setStyleProperty(element, prop, styles[prop]));
    }
}

// utils for accessing NativeScript element's styles
function setStyleProperty(element: NgView, name: string, value?: string | number) {
    withStyleProperty(name, value, (property, resolvedValue) => {
        if (isString(property)) {
            // Fallback to resolving property by name.
            const resolvedProperty = getPropertyByName(name);
            if (resolvedProperty) {
                setStyleValue(element, resolvedProperty, resolvedValue);
            } else {
                traceLog(`Unknown style property: ${property}`);
            }
        } else {
            const resolvedProperty = <StyleProperty>property;
            setStyleValue(element, resolvedProperty, value);
        }
    });
}

function setStyleValue(view: NgView, property: StyleProperty, value: any) {
    try {
        if (value === null) {
            view.style._resetValue(property, ValueSource.Local);
        } else {
            view.style._setValue(property, value, ValueSource.Local);
        }
    } catch (ex) {
        styleError("Error setting property: " + property.name + " view: " + view +
            " value: " + value + " " + ex);
    }
}
