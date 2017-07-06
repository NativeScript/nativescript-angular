import { AnimationPlayer } from "@angular/animations";
import { AnimationDriver } from "@angular/animations/browser";

import { NativeScriptAnimationPlayer } from "./animation-player";
import { Keyframe } from "./utils";
import { NgView } from "../element-registry";
import { animationsLog as traceLog } from "../trace";

export class NativeScriptAnimationDriver implements AnimationDriver {
    matchesElement(_element: any, _selector: string): boolean {
        traceLog(
            `NativeScriptAnimationDriver.matchesElement ` +
            `element: ${_element}, selector: ${_selector}`
        );

        // this method is never called since ng 4.2.5
        throw new Error("Method not implemented.");
    }

    containsElement(elm1: NgView, elm2: NgView): boolean {
        traceLog(
            `NativeScriptAnimationDriver.containsElement ` +
            `element1: ${elm1}, element2: ${elm2}`
        );

        let found = false;
        elm1.eachChild(child => {
            if (child === elm2) {
                found = true;
            }

            return !found;
        });

        return found;
    }

    // traverse children and check if they have the provided class
    query(element: any, selector: string, multi: boolean): any[] {
        traceLog(
            `NativeScriptAnimationDriver.query` +
            `element: ${element}, selector: ${selector} ` +
            `multi: ${multi}`
        );

        let results = [];
        element.eachChild(child => {
            if (child[selector]) {
                results.push(child);

                return !multi;
            }

            return false;
        });

        return results;
    }

    computeStyle(element: NgView, prop: string): string {
        traceLog(
            `NativeScriptAnimationDriver.computeStyle ` +
            `element: ${element}, prop: ${prop}`
        );

        return element.style[`css-${prop}`];
    }

    animate(
        element: NgView,
        keyframes: Keyframe[],
        duration: number,
        delay: number,
        easing: string
    ): AnimationPlayer {
        traceLog(
            `NativeScriptAnimationDriver.animate ` +
            `element: ${element}, keyframes: ${keyframes} ` +
            `duration: ${duration}, delay: ${delay} ` +
            `easing: ${easing}`
        );

        return new NativeScriptAnimationPlayer(
            element, keyframes, duration, delay, easing);
    }
}
