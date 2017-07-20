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

import { createSelector, SelectorCore } from "tns-core-modules/ui/styling/css-selector";

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

    query(element: NgView, selector: string, multi: boolean): NgView[] {
        traceLog(
            `NativeScriptAnimationDriver.query ` +
            `element: ${element}, selector: ${selector} ` +
            `multi: ${multi}`
        );

        const selectors = selector.split(",").map(s => s.trim());

        const nsSelectors: SelectorCore[] = selectors.map(createSelector);
        const classSelectors = selectors
            .filter(s => s.startsWith("."))
            .map(s => s.substring(1));

        return this.visitDescendants(element, nsSelectors, classSelectors, multi);
    }

    private visitDescendants(
        element: NgView,
        nsSelectors: SelectorCore[],
        classSelectors: string[],
        multi: boolean): NgView[] {

        let results = [];
        eachDescendant(element, child => {
            if (nsSelectors.some(s => s.match(child)) ||
                classSelectors.some(s => this.hasClass(child, s))) {
                results.push(child);
                return multi;
            }

            return true;
        });

        return results;
    }

    // we're using that instead of match for classes
    // that are dynamically added by the animation engine
    // such as .ng-trigger, that's added for every :enter view
    private hasClass(element: any, cls: string) {
        return element["$$classes"][cls];
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
