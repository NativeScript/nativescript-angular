import { AnimationPlayer } from "@angular/animations";
import { AnimationDriver } from "@angular/animations/browser";
import { eachDescendant } from "tns-core-modules/ui/core/view";

import { NativeScriptAnimationPlayer } from "./animation-player";
import {
    Keyframe,
    dashCaseToCamelCase,
} from "./utils";
import { NgView } from "../element-registry";
import { animationsLog as traceLog } from "../trace";

export class NativeScriptAnimationDriver implements AnimationDriver {
    matchesElement(_element: any, _selector: string): boolean {
        // this method is never called since NG 4.2.5
        throw new Error("Method not implemented.");
    }

    containsElement(elm1: NgView, elm2: NgView): boolean {
        traceLog(
            `NativeScriptAnimationDriver.containsElement ` +
            `element1: ${elm1}, element2: ${elm2}`
        );

        let found = false;
        eachDescendant(elm1, child => {
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
            `NativeScriptAnimationDriver.query ` +
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

        const camelCaseProp = dashCaseToCamelCase(prop);
        return element.style[camelCaseProp];
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
