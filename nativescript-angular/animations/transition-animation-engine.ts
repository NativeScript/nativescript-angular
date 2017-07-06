import {
    TransitionAnimationEngine,
    TransitionAnimationPlayer,
    QueuedTransition,
    ElementAnimationState,
    REMOVAL_FLAG,
} from "@angular/animations/browser/src/render/transition_animation_engine";
import { AUTO_STYLE, ɵPRE_STYLE as PRE_STYLE, AnimationPlayer, ɵStyleData } from "@angular/animations";
import { AnimationDriver } from "@angular/animations/browser";

import { ElementInstructionMap } from "@angular/animations/browser/src/dsl/element_instruction_map";
import { AnimationTransitionInstruction } from "@angular/animations/browser/src/dsl/animation_transition_instruction";
import {
    ENTER_CLASSNAME,
    LEAVE_CLASSNAME,
    NG_ANIMATING_SELECTOR,
    setStyles,
} from "@angular/animations/browser/src/util";
import { getOrSetAsInMap, optimizeGroupPlayer } from "@angular/animations/browser/src/render/shared";
import { unsetValue } from "tns-core-modules/ui/core/view";

import { NgView } from "../element-registry";

const NULL_REMOVED_QUERIED_STATE: ElementAnimationState = {
  namespaceId: "",
  setForRemoval: null,
  hasAnimation: false,
  removedBeforeQueried: true
};

function eraseStylesOverride(element: NgView, styles: ɵStyleData) {
    if (element["style"]) {
        Object.keys(styles).forEach(prop => {
            element.style[prop] = unsetValue;
        });
    }
}

// extending Angular's TransitionAnimationEngine
// and overriding a few methods that work on the DOM
export class NSTransitionAnimationEngine extends TransitionAnimationEngine {
    flush(microtaskId: number = -1) {
        let players: AnimationPlayer[] = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach((ns, element) => (<any>this)._balanceNamespaceList(ns, element));
            this.newHostElements.clear();
        }

        if ((<any>this)._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            players = this._flushAnimationsOverride(microtaskId);
        } else {
            for (let i = 0; i < this.collectedLeaveElements.length; i++) {
                const element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }

        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        (<any>this)._flushFns.forEach(fn => fn());
        (<any>this)._flushFns = [];

        if ((<any>this)._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            const quietFns = (<any>this)._whenQuietFns;
            (<any>this)._whenQuietFns = [];

            if (players.length) {
                optimizeGroupPlayer(players).onDone(() => { quietFns.forEach(fn => fn()); });
            } else {
                quietFns.forEach(fn => fn());
            }
        }
    }

    // _flushAnimationsOverride is almost the same as
    // _flushAnimations from Angular"s TransitionAnimationEngine.
    // A few dom-specific method invocations are replaced
    private _flushAnimationsOverride(microtaskId: number): TransitionAnimationPlayer[] {
        const subTimelines = new ElementInstructionMap();
        const skippedPlayers: TransitionAnimationPlayer[] = [];
        const skippedPlayersMap = new Map<any, AnimationPlayer[]>();
        const queuedInstructions: QueuedTransition[] = [];
        const queriedElements = new Map<any, TransitionAnimationPlayer[]>();
        const allPreStyleElements = new Map<any, Set<string>>();
        const allPostStyleElements = new Map<any, Set<string>>();

        const allEnterNodes: any[] = this.collectedEnterElements.length ?
            this.collectedEnterElements.filter(createIsRootFilterFn(this.collectedEnterElements)) :
            [];

        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        for (let i = 0; i < allEnterNodes.length; i++) {
            addClass(allEnterNodes[i], ENTER_CLASSNAME);
        }

        const allLeaveNodes: any[] = [];
        const leaveNodesWithoutAnimations: any[] = [];
        for (let i = 0; i < this.collectedLeaveElements.length; i++) {
            const element = this.collectedLeaveElements[i];
            const details = element[REMOVAL_FLAG] as ElementAnimationState;
            if (details && details.setForRemoval) {
                addClass(element, LEAVE_CLASSNAME);
                allLeaveNodes.push(element);
                if (!details.hasAnimation) {
                    leaveNodesWithoutAnimations.push(element);
                }
            }
        }

        for (let i = (<any>this)._namespaceList.length - 1; i >= 0; i--) {
            const ns = (<any>this)._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(entry => {
                const player = entry.player;

                const element = entry.element;

                // the below check is skipped, because it"s
                // irrelevant in the NativeScript context
                // if (!bodyNode || !this.driver.containsElement(bodyNode, element)) {
                //     player.destroy();
                //     return;
                // }

                const instruction = (<any>this)._buildInstruction(entry, subTimelines);
                if (!instruction) {
                    return;
                }

                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(() => eraseStylesOverride(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }

                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(tl => tl.stretchStartingKeyframe = true);

                subTimelines.append(element, instruction.timelines);

                const tuple = { instruction, player, element };

                queuedInstructions.push(tuple);

                instruction.queriedElements.forEach(
                    // tslint:disable-next-line:no-shadowed-variable
                    element => getOrSetAsInMap(queriedElements, element, []).push(player));

                // tslint:disable-next-line:no-shadowed-variable
                instruction.preStyleProps.forEach((stringMap, element) => {
                    const props = Object.keys(stringMap);
                    if (props.length) {
                        let setVal: Set<string> = allPreStyleElements.get(element)!;
                        if (!setVal) {
                            allPreStyleElements.set(element, setVal = new Set<string>());
                        }
                        props.forEach(prop => setVal.add(prop));
                    }
                });

                // tslint:disable-next-line:no-shadowed-variable
                instruction.postStyleProps.forEach((stringMap, element) => {
                    const props = Object.keys(stringMap);
                    let setVal: Set<string> = allPostStyleElements.get(element)!;
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set<string>());
                    }
                    props.forEach(prop => setVal.add(prop));
                });
            });
        }

        // these can only be detected here since we have a map of all the elements
        // that have animations attached to them...
        const enterNodesWithoutAnimations: any[] = [];
        for (let i = 0; i < allEnterNodes.length; i++) {
            const element = allEnterNodes[i];
            if (!subTimelines.has(element)) {
                enterNodesWithoutAnimations.push(element);
            }
        }

        const allPreviousPlayersMap = new Map<any, TransitionAnimationPlayer[]>();
        let sortedParentElements: any[] = [];
        queuedInstructions.forEach(entry => {
            const element = entry.element;
            if (subTimelines.has(element)) {
                sortedParentElements.unshift(element);
                this._beforeAnimationBuildOverride(
                    entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });

        skippedPlayers.forEach(player => {
            const element = player.element;
            const previousPlayers =
                (<any>this)._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(
                prevPlayer => { getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer); });
        });

        allPreviousPlayersMap.forEach(players => players.forEach(player => player.destroy()));

        // PRE STAGE: fill the ! styles
        const preStylesMap = allPreStyleElements.size ?
            cloakAndComputeStyles(
                this.driver, enterNodesWithoutAnimations, allPreStyleElements, PRE_STYLE) :
            new Map<any, ɵStyleData>();

        // POST STAGE: fill the * styles
        const postStylesMap = cloakAndComputeStyles(
            this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);

        const rootPlayers: TransitionAnimationPlayer[] = [];
        const subPlayers: TransitionAnimationPlayer[] = [];
        queuedInstructions.forEach(entry => {
            const { element, player, instruction } = entry;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                const innerPlayer = (<any>this)._buildAnimation(
                    player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap,
                    postStylesMap);
                player.setRealPlayer(innerPlayer);

                let parentHasPriority: any = null;
                for (let i = 0; i < sortedParentElements.length; i++) {
                    const parent = sortedParentElements[i];

                    if (parent === element) {
                        break;
                    }

                    if (this.driver.containsElement(parent, element)) {
                        parentHasPriority = parent;
                        break;
                    }
                }

                if (parentHasPriority) {
                    const parentPlayers = this.playersByElement.get(parentHasPriority);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                } else {
                    rootPlayers.push(player);
                }
            } else {
                eraseStylesOverride(element, instruction.fromStyles);
                player.onDestroy(() => setStyles(element, instruction.toStyles));
                subPlayers.push(player);
            }
        });

        subPlayers.forEach(player => {
            const playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                const innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });

        // the reason why we don"t actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(player => {
            if (player.parentPlayer) {
                player.parentPlayer.onDestroy(() => player.destroy());
            } else {
                player.destroy();
            }
        });

        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (let i = 0; i < allLeaveNodes.length; i++) {
            const element = allLeaveNodes[i];
            const details = element[REMOVAL_FLAG] as ElementAnimationState;

            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation) {
                continue;
            }

            let players: AnimationPlayer[] = [];

            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                let queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push(...queriedPlayerResults);
                }

                let queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (let j = 0; j < queriedInnerElements.length; j++) {
                    let queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push(...queriedPlayers);
                    }
                }
            }
            if (players.length) {
                removeNodesAfterAnimationDone(this, element, players);
            } else {
                this.processLeaveNode(element);
            }
        }

        rootPlayers.forEach(player => {
            this.players.push(player);
            player.onDone(() => {
                player.destroy();

                const index = this.players.indexOf(player);
                this.players.splice(index, 1);
            });
            player.play();
        });

        allEnterNodes.forEach(element => removeClass(element, ENTER_CLASSNAME));

        return rootPlayers;
    }

    elementContainsData(namespaceId: string, element: any) {
        let containsData = false;
        const details = element[REMOVAL_FLAG] as ElementAnimationState;

        if (details && details.setForRemoval) {
            containsData = true;
        }

        if (this.playersByElement.has(element)) {
            containsData = true;
        }

        if (this.playersByQueriedElement.has(element)) {
            containsData = true;
        }

        if (this.statesByElement.has(element)) {
            containsData = true;
        }

        return (<any>this)._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    }

    private _beforeAnimationBuildOverride(
        namespaceId: string, instruction: AnimationTransitionInstruction,
        allPreviousPlayersMap: Map<any, TransitionAnimationPlayer[]>) {
        // it"s important to do this step before destroying the players
        // so that the onDone callback below won"t fire before this
        eraseStylesOverride(instruction.element, instruction.fromStyles);

        const triggerName = instruction.triggerName;
        const rootElement = instruction.element;

        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        const targetNameSpaceId: string | undefined =
            instruction.isRemovalTransition ? undefined : namespaceId;
        const targetTriggerName: string | undefined =
            instruction.isRemovalTransition ? undefined : triggerName;

        instruction.timelines.map(timelineInstruction => {
            const element = timelineInstruction.element;
            const isQueriedElement = element !== rootElement;
            const players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            const previousPlayers = (<any>this)._getPreviousPlayers(
                element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(player => {
                const realPlayer = player.getRealPlayer() as any;
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                players.push(player);
            });
        });
    }
}


function cloakElement(element: any, value?: string) {
    const oldValue = element.style.display;
    element.style.display = value != null ? value : "none";
    return oldValue;
}

function cloakAndComputeStyles(
    driver: AnimationDriver, elements: any[], elementPropsMap: Map<any, Set<string>>,
    defaultStyle: string): Map<any, ɵStyleData> {
    const cloakVals = elements.map(element => cloakElement(element));
    const valuesMap = new Map<any, ɵStyleData>();

    elementPropsMap.forEach((props: Set<string>, element: any) => {
        const styles: ɵStyleData = {};
        props.forEach(prop => {
            const value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);

            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length === 0) {
                element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
            }
        });
        valuesMap.set(element, styles);
    });

    elements.forEach((element, i) => cloakElement(element, cloakVals[i]));
    return valuesMap;
}

/*
Since the Angular renderer code will return a collection of inserted
nodes in all areas of a DOM tree, it"s up to this algorithm to figure
out which nodes are roots.
By placing all nodes into a set and traversing upwards to the edge,
the recursive code can figure out if a clean path from the DOM node
to the edge container is clear. If no other node is detected in the
set then it is a root element.
This algorithm also keeps track of all nodes along the path so that
if other sibling nodes are also tracked then the lookup process can
skip a lot of steps in between and avoid traversing the entire tree
multiple times to the edge.
 */
function createIsRootFilterFn(nodes: any): (node: any) => boolean {
    const nodeSet = new Set(nodes);
    const knownRootContainer = new Set();
    let isRoot: (node: any) => boolean;
    isRoot = node => {
        if (!node) {
            return true;
        }
        if (nodeSet.has(node.parentNode)) {
            return false;
        }
        if (knownRootContainer.has(node.parentNode)) {
            return true;
        }
        if (isRoot(node.parentNode)) {
            knownRootContainer.add(node);
            return true;
        }
        return false;
    };
    return isRoot;
}

const CLASSES_CACHE_KEY = "$$classes";

function addClass(element: any, className: string) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        let classes: { [className: string]: boolean } = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}

function removeClass(element: any, className: string) {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        let classes: { [className: string]: boolean } = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}

function removeNodesAfterAnimationDone(
    engine: TransitionAnimationEngine, element: any, players: AnimationPlayer[]) {
    optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
