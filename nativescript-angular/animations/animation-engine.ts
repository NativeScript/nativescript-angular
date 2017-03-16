import { ɵDomAnimationEngine as DomAnimationEngine } from "@angular/platform-browser/animations";
import {
    AnimationEvent,
    AnimationPlayer,
    NoopAnimationPlayer,
    ɵAnimationGroupPlayer,
    ɵStyleData,
} from "@angular/animations";

import { unsetValue } from "tns-core-modules/ui/core/view";

import { NgView } from "../element-registry";

const MARKED_FOR_ANIMATION = "ng-animate";

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
        const players = instruction.timelines.map(timelineInstruction => {
            totalTime = Math.max(totalTime, timelineInstruction.totalTime);
            return (<any>this)._buildPlayer(element, timelineInstruction, previousPlayers);
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
            if (cssClasses(<NgView>child).get(MARKED_FOR_ANIMATION)) {
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

        cssClasses(element).set(MARKED_FOR_ANIMATION, true);
        player.onDone(() => cssClasses(element).set(MARKED_FOR_ANIMATION, false));
    }

    private _getElementAnimation(element: NgView) {
        return (<any>this)._activeElementAnimations.get(element);
    }

    private _getTransitionAnimation(element: NgView) {
        return (<any>this)._activeTransitionAnimations.get(element);
    }
}

// overriden to use the default 'unsetValue'
// instead of empty string ''
function eraseStylesOverride(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => {
            element.style[prop] = unsetValue;
        });
    }
}

function cssClasses(element: NgView) {
    if (!element.ngCssClasses) {
        element.ngCssClasses = new Map<string, boolean>();
    }
    return element.ngCssClasses;
}

function getOrSetAsInMap(map: Map<any, any>, key: any, defaultValue: any) {
    let value = map.get(key);
    if (!value) {
        map.set(key, value = defaultValue);
    }
    return value;
}

function deleteFromArrayMap(map: Map<any, any[]>, key: any, value: any) {
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

function optimizeGroupPlayer(players: AnimationPlayer[]): AnimationPlayer {
    switch (players.length) {
        case 0:
            return new NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new ɵAnimationGroupPlayer(players);
    }
}

function copyArray(source: any[]): any[] {
    return source ? source.splice(0) : [];
}

function makeAnimationEvent(
        element: NgView, triggerName: string, fromState: string, toState: string, phaseName: string,
        totalTime: number): AnimationEvent {
    return <AnimationEvent>{element, triggerName, fromState, toState, phaseName, totalTime};
}

function setStyles(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => element.style[prop] = styles[prop]);
  }
}
