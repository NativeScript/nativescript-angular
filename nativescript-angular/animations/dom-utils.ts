import {
    AnimationEvent,
    AnimationPlayer,
    NoopAnimationPlayer,
    ɵAnimationGroupPlayer,
    ɵStyleData,
} from "@angular/animations";
import { unsetValue } from "tns-core-modules/ui/core/view";

import { NgView } from "../element-types";

// overriden to use the default 'unsetValue'
// instead of empty string ''
export function eraseStylesOverride(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => {
            element.style[prop] = unsetValue;
        });
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
        Object.keys(styles).forEach(prop => element.style[prop] = styles[prop]);
    }
}
