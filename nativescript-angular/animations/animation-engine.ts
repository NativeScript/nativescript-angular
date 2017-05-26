import { ɵDomAnimationEngine as DomAnimationEngine } from "@angular/animations/browser";
import { AnimationEvent, AnimationPlayer } from "@angular/animations";

import { NgView } from "../element-registry";
import {
    copyArray,
    cssClasses,
    deleteFromArrayMap,
    eraseStylesOverride,
    getOrSetAsInMap,
    makeAnimationEvent,
    optimizeGroupPlayer,
    setStyles,
} from "./dom-utils";

const MARKED_FOR_ANIMATION_CLASSNAME = "ng-animating";
const MARKED_FOR_ANIMATION_SELECTOR = ".ng-animating";

interface QueuedAnimationTransitionTuple {
    element: NgView;
    player: AnimationPlayer;
    triggerName: string;
    event: AnimationEvent;
}

// we are extending Angular's animation engine and
// overriding a few methods that work on the DOM
export class NativeScriptAnimationEngine extends DomAnimationEngine {
    // this method is almost completely copied from
    // the original animation engine, just replaced
    // a few method invocations with overriden ones
    animateTransition(element: NgView, instruction: any): AnimationPlayer {
        const triggerName = instruction.triggerName;

        let previousPlayers: AnimationPlayer[];
        if (instruction.isRemovalTransition) {
            previousPlayers = this._onRemovalTransitionOverride(element);
        } else {
            previousPlayers = [];
            const existingTransitions = this._getTransitionAnimation(element);
            const existingPlayer = existingTransitions ? existingTransitions[triggerName] : null;
            if (existingPlayer) {
                previousPlayers.push(existingPlayer);
            }
        }

        // it's important to do this step before destroying the players
        // so that the onDone callback below won"t fire before this
        eraseStylesOverride(element, instruction.fromStyles);

        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        let totalTime = 0;
        const players = instruction.timelines.map((timelineInstruction, i) => {
            totalTime = Math.max(totalTime, timelineInstruction.totalTime);
            return (<any>this)._buildPlayer(element, timelineInstruction, previousPlayers, i);
        });

        previousPlayers.forEach(previousPlayer => previousPlayer.destroy());
        const player = optimizeGroupPlayer(players);
        player.onDone(() => {
            player.destroy();
            const elmTransitionMap = this._getTransitionAnimation(element);
            if (elmTransitionMap) {
                delete elmTransitionMap[triggerName];
                if (Object.keys(elmTransitionMap).length === 0) {
                    (<any>this)._activeTransitionAnimations.delete(element);
                }
            }
            deleteFromArrayMap((<any>this)._activeElementAnimations, element, player);
            setStyles(element, instruction.toStyles);
        });

        const elmTransitionMap = getOrSetAsInMap((<any>this)._activeTransitionAnimations, element, {});
        elmTransitionMap[triggerName] = player;

        this._queuePlayerOverride(
                element, triggerName, player,
                makeAnimationEvent(
                        element, triggerName, instruction.fromState, instruction.toState,
                        null,    // this will be filled in during event creation
                        totalTime));

        return player;
    }

   // overriden to use eachChild method of View
   // instead of DOM querySelectorAll
   private _onRemovalTransitionOverride(element: NgView): AnimationPlayer[] {
        // when a parent animation is set to trigger a removal we want to
        // find all of the children that are currently animating and clear
        // them out by destroying each of them.
        let elms = [];
        element.eachChild(child => {
            if (cssClasses(<NgView>child).get(MARKED_FOR_ANIMATION_SELECTOR)) {
                elms.push(child);
            }

            return true;
        });

        for (let i = 0; i < elms.length; i++) {
            const elm = elms[i];
            const activePlayers = this._getElementAnimation(elm);
            if (activePlayers) {
                activePlayers.forEach(player => player.destroy());
            }

            const activeTransitions = this._getTransitionAnimation(elm);
            if (activeTransitions) {
                Object.keys(activeTransitions).forEach(triggerName => {
                    const player = activeTransitions[triggerName];
                    if (player) {
                        player.destroy();
                    }
                });
            }
        }

        // we make a copy of the array because the actual source array is modified
        // each time a player is finished/destroyed (the forEach loop would fail otherwise)
        return copyArray(this._getElementAnimation(element));
    }

    // overriden to use cssClasses method to access native element's styles
    // instead of DOM element's classList
    private _queuePlayerOverride(
        element: NgView, triggerName: string, player: AnimationPlayer, event: AnimationEvent) {
        const tuple = <QueuedAnimationTransitionTuple>{ element, player, triggerName, event };
        (<any>this)._queuedTransitionAnimations.push(tuple);
        player.init();

        cssClasses(element).set(MARKED_FOR_ANIMATION_CLASSNAME, true);
        player.onDone(() => cssClasses(element).set(MARKED_FOR_ANIMATION_CLASSNAME, false));
    }

    private _getElementAnimation(element: NgView) {
        return (<any>this)._activeElementAnimations.get(element);
    }

    private _getTransitionAnimation(element: NgView) {
        return (<any>this)._activeTransitionAnimations.get(element);
    }
}
